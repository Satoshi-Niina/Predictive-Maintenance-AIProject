const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// 機械一覧の取得
router.get('/machines', async (req, res) => {
  try {
    const machines = [
      {
        id: 1,
        name: '保守用車両A',
        type: '鉄道保守用',
        status: 'active',
        lastMaintenance: '2025-04-20',
        nextMaintenance: '2025-05-20',
        components: ['ブレーキ', 'エンジン', 'トランスミッション']
      },
      {
        id: 2,
        name: '保守用車両B',
        type: '鉄道保守用',
        status: 'maintenance',
        lastMaintenance: '2025-04-15',
        nextMaintenance: '2025-05-15',
        components: ['ブレーキ', 'エンジン', 'トランスミッション']
      }
    ];

    res.json({
      status: 'success',
      machines
    });
  } catch (error) {
    console.error('Error fetching machines:', error);
    res.status(500).json({
      status: 'error',
      message: '機械一覧の取得に失敗しました'
    });
  }
});

// 機械の詳細情報の取得
router.get('/machines/:id', async (req, res) => {
  try {
    const machineId = parseInt(req.params.id);
    const machine = {
      id: machineId,
      name: '保守用車両A',
      type: '鉄道保守用',
      status: 'active',
      lastMaintenance: '2025-04-20',
      nextMaintenance: '2025-05-20',
      components: [
        {
          name: 'ブレーキ',
          status: 'warning',
          lastCheck: '2025-04-25',
          nextCheck: '2025-05-25'
        },
        {
          name: 'エンジン',
          status: 'normal',
          lastCheck: '2025-04-20',
          nextCheck: '2025-05-20'
        },
        {
          name: 'トランスミッション',
          status: 'normal',
          lastCheck: '2025-04-20',
          nextCheck: '2025-05-20'
        }
      ],
      maintenanceHistory: [
        {
          date: '2025-04-20',
          type: '定期点検',
          description: '通常の定期点検を実施',
          technician: '山田太郎'
        },
        {
          date: '2025-03-15',
          type: '修理',
          description: 'ブレーキパッドの交換',
          technician: '鈴木一郎'
        }
      ]
    };

    res.json({
      status: 'success',
      machine
    });
  } catch (error) {
    console.error('Error fetching machine details:', error);
    res.status(500).json({
      status: 'error',
      message: '機械の詳細情報の取得に失敗しました'
    });
  }
});

// 機械のメンテナンス履歴の取得
router.get('/machines/:id/maintenance', async (req, res) => {
  try {
    const machineId = parseInt(req.params.id);
    const maintenanceHistory = [
      {
        date: '2025-04-20',
        type: '定期点検',
        description: '通常の定期点検を実施',
        technician: '山田太郎',
        components: ['ブレーキ', 'エンジン', 'トランスミッション']
      },
      {
        date: '2025-03-15',
        type: '修理',
        description: 'ブレーキパッドの交換',
        technician: '鈴木一郎',
        components: ['ブレーキ']
      }
    ];

    res.json({
      status: 'success',
      maintenanceHistory
    });
  } catch (error) {
    console.error('Error fetching maintenance history:', error);
    res.status(500).json({
      status: 'error',
      message: 'メンテナンス履歴の取得に失敗しました'
    });
  }
});

module.exports = router; 