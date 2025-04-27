const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// 予測結果の取得
router.get('/predictions', async (req, res) => {
  try {
    const faultDataPath = path.join(__dirname, '../../attached_assets/export_2025-04-26T09-19-41-202Z.json');
    const data = await fs.readFile(faultDataPath, 'utf8');
    const faultData = JSON.parse(data);

    // 予測結果の生成（実際の予測ロジックは別途実装）
    const predictionResult = {
      predictedFaults: [
        {
          component: 'ブレーキ',
          probability: 0.85,
          estimatedTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          severity: 'high',
          recommendedActions: [
            'ブレーキパッドの点検',
            'ブレーキフルードの交換',
            'ブレーキシステムの総点検'
          ]
        }
      ],
      confidence: 0.75,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      status: 'success',
      result: predictionResult
    });
  } catch (error) {
    console.error('Error generating predictions:', error);
    res.status(500).json({
      status: 'error',
      message: '予測の生成に失敗しました'
    });
  }
});

// 予測履歴の取得
router.get('/prediction-history', async (req, res) => {
  try {
    // サンプルの予測履歴データ
    const history = [
      {
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        actualFaults: ['ブレーキ'],
        predictedFaults: ['ブレーキ'],
        accuracy: 0.9
      },
      {
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        actualFaults: ['エンジン'],
        predictedFaults: ['エンジン', 'トランスミッション'],
        accuracy: 0.7
      }
    ];

    res.json({
      status: 'success',
      history
    });
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    res.status(500).json({
      status: 'error',
      message: '予測履歴の取得に失敗しました'
    });
  }
});

// 予測精度の取得
router.get('/prediction-accuracy', async (req, res) => {
  try {
    const accuracy = {
      overall: 0.8,
      byComponent: {
        'ブレーキ': 0.9,
        'エンジン': 0.7,
        'トランスミッション': 0.75
      },
      bySeverity: {
        'high': 0.85,
        'medium': 0.75,
        'low': 0.65
      }
    };

    res.json({
      status: 'success',
      accuracy
    });
  } catch (error) {
    console.error('Error fetching prediction accuracy:', error);
    res.status(500).json({
      status: 'error',
      message: '予測精度の取得に失敗しました'
    });
  }
});

// 予測モデルの更新
router.post('/update-model', async (req, res) => {
  try {
    // 実際のモデル更新ロジックは別途実装
    res.json({
      status: 'success',
      message: '予測モデルを更新しました'
    });
  } catch (error) {
    console.error('Error updating prediction model:', error);
    res.status(500).json({
      status: 'error',
      message: '予測モデルの更新に失敗しました'
    });
  }
});

module.exports = router; 