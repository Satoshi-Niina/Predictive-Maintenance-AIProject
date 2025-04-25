import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

export default function externalRoutes(upload: multer.Multer) {
  // 外部データのアップロード
  router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { machineId } = req.body;
      const filePath = req.file.path;
      const fileType = path.extname(req.file.originalname).toLowerCase();

      // ファイルの処理
      let processedData;
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
        default:
          return res.status(400).json({ error: 'Unsupported file type' });
      }

      // 外部データは常に保存
      const savePath = path.join(__dirname, '../../data/external', machineId, 'processed');
      if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath, { recursive: true });
      }

      const saveFileName = `${Date.now()}_processed.json`;
      fs.writeFileSync(
        path.join(savePath, saveFileName),
        JSON.stringify(processedData, null, 2)
      );

      res.json({
        success: true,
        data: processedData
      });
    } catch (error) {
      console.error('Error processing external data:', error);
      res.status(500).json({ error: 'Error processing external data' });
    }
  });

  // 外部データの取得
  router.get('/:machineId', (req, res) => {
    try {
      const { machineId } = req.params;
      const externalPath = path.join(__dirname, '../../data/external', machineId, 'processed');

      if (!fs.existsSync(externalPath)) {
        return res.json({ data: [] });
      }

      const files = fs.readdirSync(externalPath);
      const processedData = files.map(file => {
        const content = fs.readFileSync(path.join(externalPath, file), 'utf-8');
        return {
          fileName: file,
          data: JSON.parse(content)
        };
      });

      res.json({ data: processedData });
    } catch (error) {
      console.error('Error fetching external data:', error);
      res.status(500).json({ error: 'Error fetching external data' });
    }
  });

  return router;
}

async function processJSON(filePath: string): Promise<any> {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

async function processText(filePath: string): Promise<string> {
  return fs.readFileSync(filePath, 'utf-8');
}

async function processExcel(filePath: string): Promise<any> {
  // Excelファイルの処理は後で実装
  throw new Error('Excel processing not implemented yet');
} 