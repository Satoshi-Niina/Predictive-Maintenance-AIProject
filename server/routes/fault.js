const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// 故障情報の取得
router.get('/fault-data', async (req, res) => {
  try {
    const faultDataPath = path.join(__dirname, '../../attached_assets/export_2025-04-26T09-19-41-202Z.json');
    const data = await fs.readFile(faultDataPath, 'utf8');
    const faultData = JSON.parse(data);
    res.json({
      status: 'success',
      data: faultData
    });
  } catch (error) {
    console.error('Error reading fault data:', error);
    res.status(500).json({
      status: 'error',
      message: '故障情報の取得に失敗しました'
    });
  }
});

// 故障履歴の取得
router.get('/fault-history', async (req, res) => {
  try {
    const faultDataPath = path.join(__dirname, '../../attached_assets/export_2025-04-26T09-19-41-202Z.json');
    const data = await fs.readFile(faultDataPath, 'utf8');
    const faultData = JSON.parse(data);
    res.json({
      status: 'success',
      history: faultData.conversation_history
    });
  } catch (error) {
    console.error('Error reading fault history:', error);
    res.status(500).json({
      status: 'error',
      message: '故障履歴の取得に失敗しました'
    });
  }
});

// 診断情報の取得
router.get('/diagnostics', async (req, res) => {
  try {
    const faultDataPath = path.join(__dirname, '../../attached_assets/export_2025-04-26T09-19-41-202Z.json');
    const data = await fs.readFile(faultDataPath, 'utf8');
    const faultData = JSON.parse(data);
    res.json({
      status: 'success',
      diagnostics: faultData.diagnostics
    });
  } catch (error) {
    console.error('Error reading diagnostics:', error);
    res.status(500).json({
      status: 'error',
      message: '診断情報の取得に失敗しました'
    });
  }
});

module.exports = router; 