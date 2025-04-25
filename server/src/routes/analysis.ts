import express from 'express';
import { AnalysisService } from '../services/analysisService';
import multer from 'multer';
import { DocumentProcessor } from '../services/documentProcessor';
import { DataIntegrationService } from '../services/dataIntegrationService';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const analysisService = new AnalysisService();
const documentProcessor = new DocumentProcessor();
const dataIntegrationService = new DataIntegrationService();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// ファイルアップロード
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    await documentProcessor.processFile(req.file);
    res.json({ message: 'File processed successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// JSONデータの処理
router.post('/process-json', async (req, res) => {
  try {
    await documentProcessor.processJsonData(req.body);
    res.json({ message: 'JSON data processed successfully' });
  } catch (error) {
    console.error('Error processing JSON:', error);
    res.status(500).json({ error: 'Error processing JSON data' });
  }
});

// 画像データの処理
router.post('/process-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    // TODO: 画像からテキストを抽出する処理を実装
    const extractedText = ''; // 画像から抽出したテキスト
    await documentProcessor.processImage(req.file.path, extractedText);
    res.json({ message: 'Image processed successfully' });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
});

// 故障分析
router.post('/analyze-failure', async (req, res) => {
  try {
    const { query } = req.body;
    const result = await analysisService.analyzeFailure(query);
    res.json({ result });
  } catch (error) {
    console.error('Error analyzing failure:', error);
    res.status(500).json({ error: 'Error analyzing failure' });
  }
});

// メンテナンス項目の予測
router.post('/predict-maintenance', async (req, res) => {
  try {
    const { query } = req.body;
    const result = await analysisService.predictMaintenanceItems(query);
    res.json({ result });
  } catch (error) {
    console.error('Error predicting maintenance:', error);
    res.status(500).json({ error: 'Error predicting maintenance' });
  }
});

// 予防保全の予測
router.post('/predict-preventive', async (req, res) => {
  try {
    const { schedule } = req.body;
    const result = await analysisService.predictPreventiveMaintenance(schedule);
    res.json({ result });
  } catch (error) {
    console.error('Error predicting preventive maintenance:', error);
    res.status(500).json({ error: 'Error predicting preventive maintenance' });
  }
});

// データの統合
router.post('/integrate/:machineId', async (req, res) => {
  try {
    const { machineId } = req.params;
    const result = await dataIntegrationService.integrateData(machineId);
    res.json(result);
  } catch (error) {
    console.error('Error in data integration:', error);
    res.status(500).json({ error: 'Error integrating data' });
  }
});

// 新しい故障報告の処理と分析
router.post('/failure-report/:machineId', async (req, res) => {
  try {
    const { machineId } = req.params;
    const reportData = req.body;
    const result = await dataIntegrationService.processNewFailureReport(machineId, reportData);
    res.json(result);
  } catch (error) {
    console.error('Error processing failure report:', error);
    res.status(500).json({ error: 'Error processing failure report' });
  }
});

// 対策の詳細分析
router.post('/countermeasures/:machineId/:analysisId', async (req, res) => {
  try {
    const { machineId, analysisId } = req.params;
    const result = await dataIntegrationService.analyzeCountermeasures(machineId, analysisId);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing countermeasures:', error);
    res.status(500).json({ error: 'Error analyzing countermeasures' });
  }
});

// 分析履歴の取得
router.get('/history/:machineId', async (req, res) => {
  try {
    const { machineId } = req.params;
    const dataDir = path.join(__dirname, '../../data');
    const analysisPath = path.join(dataDir, 'analysis', machineId);

    if (!fs.existsSync(analysisPath)) {
      return res.json({ analyses: [] });
    }

    const files = fs.readdirSync(analysisPath)
      .filter(file => file.endsWith('_analysis.json'));

    const analyses = files.map(file => {
      const content = fs.readFileSync(path.join(analysisPath, file), 'utf-8');
      return JSON.parse(content);
    });

    res.json({ analyses });
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    res.status(500).json({ error: 'Error fetching analysis history' });
  }
});

export default router; 