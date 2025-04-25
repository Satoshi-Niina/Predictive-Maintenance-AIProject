import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const router = express.Router();

// 故障情報の保存先ディレクトリ
const DATA_DIR = path.join(__dirname, '../../../data');
const FAILURE_DIR = path.join(DATA_DIR, 'failure');
const FAILURE_JSON_DIR = path.join(FAILURE_DIR, 'json');
const FAILURE_IMAGES_DIR = path.join(FAILURE_DIR, 'images');
const FAILURE_ANALYSIS_DIR = path.join(FAILURE_DIR, 'analysis');
const KNOWLEDGE_DIR = path.join(DATA_DIR, 'knowledge/processed');

// ディレクトリの作成
[FAILURE_DIR, FAILURE_JSON_DIR, FAILURE_IMAGES_DIR, FAILURE_ANALYSIS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ファイルアップロードの設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'images') {
      cb(null, FAILURE_IMAGES_DIR);
    } else {
      cb(null, FAILURE_JSON_DIR);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    if (file.fieldname === 'images') {
      cb(null, `failure_${timestamp}_${file.originalname}`);
    } else {
      cb(null, `failure_${timestamp}${ext}`);
    }
  }
});

const upload = multer({ storage: storage });

// 故障情報の登録
router.post('/register', upload.fields([
  { name: 'failureData', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const timestamp = Date.now();
    const result: any = {
      timestamp,
      data: null,
      images: []
    };

    // JSONデータの処理
    if (files.failureData && files.failureData[0]) {
      const jsonFile = files.failureData[0];
      const jsonContent = fs.readFileSync(jsonFile.path, 'utf-8');
      result.data = JSON.parse(jsonContent);
      result.jsonFile = jsonFile.filename;
    }

    // 画像の処理
    if (files.images) {
      for (const image of files.images) {
        try {
          // 画像の最適化
          const optimizedFileName = `optimized_${image.filename}`;
          const optimizedPath = path.join(FAILURE_IMAGES_DIR, optimizedFileName);
          
          await sharp(image.path)
            .resize(1200, 1200, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toFile(optimizedPath);

          // 元の画像を削除
          fs.unlinkSync(image.path);

          result.images.push({
            originalName: image.originalname,
            filename: optimizedFileName
          });
        } catch (error) {
          console.error(`Error processing image ${image.filename}:`, error);
        }
      }
    }

    // 結果をJSONファイルとして保存
    const resultFileName = `failure_${timestamp}_complete.json`;
    fs.writeFileSync(
      path.join(FAILURE_JSON_DIR, resultFileName),
      JSON.stringify(result, null, 2)
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error registering failure:', error);
    res.status(500).json({ error: '故障情報の登録に失敗しました' });
  }
});

// 故障情報一覧の取得
router.get('/list', (req, res) => {
  try {
    const files = fs.readdirSync(FAILURE_JSON_DIR)
      .filter(file => file.endsWith('_complete.json'))
      .sort((a, b) => {
        const timeA = parseInt(a.split('_')[1]);
        const timeB = parseInt(b.split('_')[1]);
        return timeB - timeA;
      });

    const failures = files.map(file => {
      const content = fs.readFileSync(path.join(FAILURE_JSON_DIR, file), 'utf-8');
      return JSON.parse(content);
    });

    res.json({ failures });
  } catch (error) {
    console.error('Error fetching failure list:', error);
    res.status(500).json({ error: '故障情報の取得に失敗しました' });
  }
});

// 故障情報の詳細取得
router.get('/detail/:id', (req, res) => {
  try {
    const failureId = req.params.id;
    const filePath = path.join(FAILURE_JSON_DIR, `${failureId}_complete.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '指定された故障情報が見つかりません' });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const failureData = JSON.parse(content);

    res.json(failureData);
  } catch (error) {
    console.error('Error fetching failure detail:', error);
    res.status(500).json({ error: '故障情報の取得に失敗しました' });
  }
});

// 故障画像の取得
router.get('/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(FAILURE_IMAGES_DIR, filename);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: '指定された画像が見つかりません' });
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: '画像の取得に失敗しました' });
  }
});

// 故障分析の実行
router.post('/analyze', async (req, res) => {
  try {
    const { failureId, documentIds } = req.body;

    if (!failureId || !documentIds || !Array.isArray(documentIds)) {
      return res.status(400).json({ error: '必要なパラメータが不足しています' });
    }

    // 故障情報の取得
    const failureFilePath = path.join(FAILURE_JSON_DIR, `${failureId}_complete.json`);
    if (!fs.existsSync(failureFilePath)) {
      return res.status(404).json({ error: '指定された故障情報が見つかりません' });
    }
    const failureContent = fs.readFileSync(failureFilePath, 'utf-8');
    const failureData = JSON.parse(failureContent);

    // 技術文書の取得と解析
    const documents = [];
    for (const docId of documentIds) {
      const docPath = path.join(KNOWLEDGE_DIR, `${docId}`);
      if (fs.existsSync(docPath)) {
        const docContent = fs.readFileSync(docPath, 'utf-8');
        const docData = JSON.parse(docContent);
        documents.push(docData);
      }
    }

    if (documents.length === 0) {
      return res.status(404).json({ error: '有効な技術文書が見つかりません' });
    }

    // 分析結果の生成
    const analysisResult = {
      timestamp: Date.now(),
      failureId: failureId,
      failureData: failureData,
      analyzedDocuments: documents.map(doc => ({
        id: doc.originalName,
        type: doc.fileType,
        relevance: calculateRelevance(failureData, doc)
      })),
      suggestedActions: generateSuggestedActions(failureData, documents),
      riskLevel: assessRiskLevel(failureData),
      estimatedResolutionTime: estimateResolutionTime(failureData, documents)
    };

    // 分析結果の保存
    const analysisFileName = `analysis_${Date.now()}_${failureId}.json`;
    fs.writeFileSync(
      path.join(FAILURE_ANALYSIS_DIR, analysisFileName),
      JSON.stringify(analysisResult, null, 2)
    );

    res.json({
      success: true,
      analysisId: analysisFileName,
      result: analysisResult
    });
  } catch (error) {
    console.error('Error analyzing failure:', error);
    res.status(500).json({ error: '故障分析の実行に失敗しました' });
  }
});

// 分析結果の取得
router.get('/analysis/:failureId', (req, res) => {
  try {
    const failureId = req.params.failureId;
    const analysisFiles = fs.readdirSync(FAILURE_ANALYSIS_DIR)
      .filter(file => file.includes(failureId))
      .sort((a, b) => {
        const timeA = parseInt(a.split('_')[1]);
        const timeB = parseInt(b.split('_')[1]);
        return timeB - timeA;
      });

    if (analysisFiles.length === 0) {
      return res.status(404).json({ error: '分析結果が見つかりません' });
    }

    const latestAnalysis = fs.readFileSync(
      path.join(FAILURE_ANALYSIS_DIR, analysisFiles[0]),
      'utf-8'
    );

    res.json(JSON.parse(latestAnalysis));
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ error: '分析結果の取得に失敗しました' });
  }
});

// 分析用ユーティリティ関数
function calculateRelevance(failureData: any, document: any): number {
  // 文書の関連度を計算（0-1の値）
  // 実際のプロジェクトでは、より高度なアルゴリズムを実装
  return 0.5;
}

function generateSuggestedActions(failureData: any, documents: any[]): string[] {
  // 推奨アクションのリストを生成
  return [
    '該当部品の点検',
    '安全確認手順の実施',
    'メーカーへの問い合わせ'
  ];
}

function assessRiskLevel(failureData: any): string {
  // リスクレベルの評価（低・中・高）
  return '中';
}

function estimateResolutionTime(failureData: any, documents: any[]): string {
  // 解決までの推定時間
  return '2-3時間';
}

export default router; 