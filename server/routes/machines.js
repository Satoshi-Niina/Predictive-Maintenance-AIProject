const express = require('express');
const router = express.Router();

// 機械データを取得するエンドポイント
router.get('/machines', async (req, res) => {
  try {
    // ここで実際のデータベースやファイルからデータを取得する処理を実装
    // 現在はダミーデータを返す
    const dummyData = [
      {
        machineId: 'M001',
        timestamp: new Date().toISOString(),
        data: {
          temperature: 25.5,
          pressure: 1013.2,
          status: 'normal'
        }
      }
    ];
    
    res.json(dummyData);
  } catch (error) {
    console.error('Error fetching machine data:', error);
    res.status(500).json({ error: 'Failed to fetch machine data' });
  }
});

module.exports = router; 