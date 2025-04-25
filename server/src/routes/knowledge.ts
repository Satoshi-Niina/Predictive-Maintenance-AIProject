import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { diffLines } from 'diff';
import * as XLSX from 'xlsx';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import sharp from 'sharp';

const router = express.Router();

// ナレッジデータの保存先ディレクトリ
const KNOWLEDGE_DIR = path.join(__dirname, '../../../data/knowledge');
const PROCESSED_DIR = path.join(KNOWLEDGE_DIR, 'processed');
const ORIGINAL_DIR = path.join(KNOWLEDGE_DIR, 'original');
const DIFF_DIR = path.join(KNOWLEDGE_DIR, 'diffs');
const IMAGES_DIR = path.join(KNOWLEDGE_DIR, 'images');

// 故障情報の保存先ディレクトリ
const FAILURE_DIR = path.join(__dirname, '../../../data/failure');
const FAILURE_JSON_DIR = path.join(FAILURE_DIR, 'json');
const FAILURE_IMAGES_DIR = path.join(FAILURE_DIR, 'images');

// ディレクトリが存在しない場合は作成
[
  KNOWLEDGE_DIR, PROCESSED_DIR, ORIGINAL_DIR, DIFF_DIR, IMAGES_DIR,
  FAILURE_DIR, FAILURE_JSON_DIR, FAILURE_IMAGES_DIR
].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ファイルアップロードの設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ORIGINAL_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});

const upload = multer({ storage: storage });

// 最新のナレッジファイルを取得
const getLatestKnowledgeFile = (fileType: string): string | null => {
  const files = fs.readdirSync(PROCESSED_DIR)
    .filter(file => file.endsWith(`${fileType}_processed.json`))
    .sort((a, b) => {
      const timeA = parseInt(a.split('_')[0]);
      const timeB = parseInt(b.split('_')[0]);
      return timeB - timeA;
    });
  
  return files.length > 0 ? files[0] : null;
};

// 差分を計算して保存
const saveDiff = (oldContent: string, newContent: string, newFileName: string) => {
  const differences = diffLines(oldContent, newContent);
  const diffData = {
    timestamp: Date.now(),
    fileName: newFileName,
    differences: differences.map(part => ({
      value: part.value,
      added: part.added || false,
      removed: part.removed || false
    }))
  };

  const diffFileName = `${Date.now()}_diff.json`;
  fs.writeFileSync(
    path.join(DIFF_DIR, diffFileName),
    JSON.stringify(diffData, null, 2)
  );

  return diffFileName;
};

// ファイル処理関数
async function processJSON(filePath: string): Promise<any> {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

async function processText(filePath: string): Promise<string> {
  return fs.readFileSync(filePath, 'utf-8');
}

async function processExcel(filePath: string): Promise<any> {
  const workbook = XLSX.readFile(filePath);
  const result: any = {};
  
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
  });

  return result;
}

async function processPDF(filePath: string): Promise<any> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return {
    text: data.text,
    info: data.info,
    metadata: data.metadata,
    pageCount: data.numpages
  };
}

async function processWord(filePath: string): Promise<any> {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return {
    text: result.value,
    messages: result.messages
  };
}

async function processImage(filePath: string): Promise<any> {
  const image = sharp(filePath);
  const metadata = await image.metadata();
  
  // 画像を最適化して保存
  const optimizedFileName = `${Date.now()}_optimized${path.extname(filePath)}`;
  const optimizedPath = path.join(IMAGES_DIR, optimizedFileName);
  
  await image
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 80 })
    .toFile(optimizedPath);

  return {
    metadata,
    optimizedPath: optimizedFileName
  };
}

// ナレッジデータのアップロード
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'ファイルがアップロードされていません' });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase();
    const saveOriginal = req.body.saveOriginal === 'true';

    // ファイルの処理
    let processedData;
    try {
      switch (fileType) {
        case '.json':
          processedData = await processJSON(filePath);
          break;
        case '.txt':
          processedData = await processText(filePath);
          break;
        case '.xlsx':
        case '.xls':
          processedData = await processExcel(filePath);
          break;
        case '.pdf':
          processedData = await processPDF(filePath);
          break;
        case '.docx':
          processedData = await processWord(filePath);
          break;
        case '.jpg':
        case '.jpeg':
        case '.png':
        case '.gif':
          processedData = await processImage(filePath);
          break;
        default:
          return res.status(400).json({ error: 'サポートされていないファイル形式です' });
      }

      // 最新の同じ種類のファイルを検索
      const latestFile = getLatestKnowledgeFile(fileType.substring(1));
      let diffFileName = null;

      if (latestFile && !fileType.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const latestContent = fs.readFileSync(path.join(PROCESSED_DIR, latestFile), 'utf-8');
        const newContent = typeof processedData === 'string' 
          ? processedData 
          : JSON.stringify(processedData, null, 2);
        
        // 差分を計算して保存（画像以外のファイルのみ）
        diffFileName = saveDiff(latestContent, newContent, req.file.originalname);
      }

      // 処理済みデータを保存
      const processedFileName = `${Date.now()}${fileType}_processed.json`;
      fs.writeFileSync(
        path.join(PROCESSED_DIR, processedFileName),
        JSON.stringify({
          originalName: req.file.originalname,
          fileType: fileType,
          processedData: processedData
        }, null, 2)
      );

      // 元のファイルを保存しない場合は削除
      if (!saveOriginal) {
        fs.unlinkSync(filePath);
      }

      res.json({
        success: true,
        data: processedData,
        savedOriginal: saveOriginal,
        hasDiff: !!diffFileName,
        diffFile: diffFileName
      });
    } catch (error) {
      // エラーが発生した場合、アップロードされたファイルを削除
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error processing knowledge data:', error);
    res.status(500).json({ error: 'ナレッジデータの処理に失敗しました' });
  }
});

// 差分情報の取得
router.get('/diffs', async (req, res) => {
  try {
    const files = fs.readdirSync(DIFF_DIR)
      .filter(file => file.endsWith('_diff.json'))
      .sort((a, b) => {
        const timeA = parseInt(a.split('_')[0]);
        const timeB = parseInt(b.split('_')[0]);
        return timeB - timeA;
      });

    const diffs = files.map(file => {
      const content = fs.readFileSync(path.join(DIFF_DIR, file), 'utf-8');
      return JSON.parse(content);
    });

    res.json({ diffs });
  } catch (error) {
    console.error('Error fetching diffs:', error);
    res.status(500).json({ error: '差分データの取得に失敗しました' });
  }
});

// ナレッジデータの取得
router.get('/', async (req, res) => {
  try {
    const files = fs.readdirSync(PROCESSED_DIR)
      .filter(file => file.endsWith('_processed.json'));

    const knowledgeData = files.map(file => {
      const content = fs.readFileSync(path.join(PROCESSED_DIR, file), 'utf-8');
      const data = JSON.parse(content);
      return {
        id: file,
        filename: file,
        originalName: data.originalName,
        fileType: data.fileType,
        content: data.processedData,
        uploadedAt: fs.statSync(path.join(PROCESSED_DIR, file)).mtime.toISOString()
      };
    });

    res.json({ knowledge: knowledgeData });
  } catch (error) {
    console.error('Error fetching knowledge data:', error);
    res.status(500).json({ error: 'ナレッジデータの取得に失敗しました' });
  }
});

// 故障情報の保存
router.post('/failure/data', express.json(), async (req, res) => {
  try {
    const { failureData, images } = req.body;
    const timestamp = Date.now();

    // JSON データの保存
    const jsonFileName = `failure_${timestamp}.json`;
    fs.writeFileSync(
      path.join(FAILURE_JSON_DIR, jsonFileName),
      JSON.stringify(failureData, null, 2)
    );

    // Base64画像の保存（存在する場合）
    const savedImages = [];
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i];
        const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          const imageType = matches[1].split('/')[1];
          const imageBuffer = Buffer.from(matches[2], 'base64');
          const imageName = `failure_${timestamp}_${i}.${imageType}`;
          const imagePath = path.join(FAILURE_IMAGES_DIR, imageName);
          
          await sharp(imageBuffer)
            .resize(1200, 1200, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .toFile(imagePath);
          
          savedImages.push(imageName);
        }
      }
    }

    res.json({
      success: true,
      jsonFile: jsonFileName,
      imageFiles: savedImages
    });
  } catch (error) {
    console.error('Error saving failure data:', error);
    res.status(500).json({ error: '故障情報の保存に失敗しました' });
  }
});

// 故障情報の一覧取得
router.get('/failure/list', async (req, res) => {
  try {
    const jsonFiles = fs.readdirSync(FAILURE_JSON_DIR)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        const timeA = parseInt(a.split('_')[1]);
        const timeB = parseInt(b.split('_')[1]);
        return timeB - timeA;
      });

    const failureList = jsonFiles.map(file => {
      const content = fs.readFileSync(path.join(FAILURE_JSON_DIR, file), 'utf-8');
      const data = JSON.parse(content);
      const timestamp = parseInt(file.split('_')[1]);
      
      // 関連する画像ファイルを検索
      const relatedImages = fs.readdirSync(FAILURE_IMAGES_DIR)
        .filter(img => img.startsWith(`failure_${timestamp}`))
        .map(img => ({
          filename: img,
          url: `/failure/images/${img}`
        }));

      return {
        id: file,
        timestamp: timestamp,
        data: data,
        images: relatedImages
      };
    });

    res.json({ failures: failureList });
  } catch (error) {
    console.error('Error fetching failure list:', error);
    res.status(500).json({ error: '故障情報の取得に失敗しました' });
  }
});

// 故障画像の取得
router.get('/failure/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(FAILURE_IMAGES_DIR, filename);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: '画像が見つかりません' });
  }
});

export default router; 