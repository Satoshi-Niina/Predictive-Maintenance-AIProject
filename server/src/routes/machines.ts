import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// 機械データの保存先ディレクトリ
const MACHINES_DIR = path.join(__dirname, '../../../data/machines');
const MACHINES_FILE = path.join(MACHINES_DIR, 'machines.json');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(MACHINES_DIR)) {
  fs.mkdirSync(MACHINES_DIR, { recursive: true });
}

// 初期データが存在しない場合は作成
if (!fs.existsSync(MACHINES_FILE)) {
  const initialData = {
    machines: [
      {
        id: '1',
        name: 'プレス機 A-1',
        type: 'プレス機',
        status: '正常',
        lastMaintenance: new Date().toISOString(),
      },
      {
        id: '2',
        name: '旋盤 B-1',
        type: '旋盤',
        status: '注意',
        lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };
  fs.writeFileSync(MACHINES_FILE, JSON.stringify(initialData, null, 2));
}

// 機械一覧の取得
router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(MACHINES_FILE, 'utf-8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading machines data:', error);
    res.status(500).json({ error: '機械データの読み込みに失敗しました' });
  }
});

// 機械の詳細取得
router.get('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(MACHINES_FILE, 'utf-8'));
    const machine = data.machines.find((m: any) => m.id === req.params.id);
    
    if (!machine) {
      return res.status(404).json({ error: '機械が見つかりません' });
    }
    
    res.json(machine);
  } catch (error) {
    console.error('Error reading machine data:', error);
    res.status(500).json({ error: '機械データの読み込みに失敗しました' });
  }
});

// 新規機械の登録
router.post('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(MACHINES_FILE, 'utf-8'));
    const newMachine = {
      id: Date.now().toString(),
      ...req.body,
      lastMaintenance: new Date().toISOString(),
    };
    
    data.machines.push(newMachine);
    fs.writeFileSync(MACHINES_FILE, JSON.stringify(data, null, 2));
    
    res.status(201).json(newMachine);
  } catch (error) {
    console.error('Error creating machine:', error);
    res.status(500).json({ error: '機械の登録に失敗しました' });
  }
});

// 機械情報の更新
router.put('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(MACHINES_FILE, 'utf-8'));
    const index = data.machines.findIndex((m: any) => m.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: '機械が見つかりません' });
    }
    
    data.machines[index] = {
      ...data.machines[index],
      ...req.body,
    };
    
    fs.writeFileSync(MACHINES_FILE, JSON.stringify(data, null, 2));
    res.json(data.machines[index]);
  } catch (error) {
    console.error('Error updating machine:', error);
    res.status(500).json({ error: '機械情報の更新に失敗しました' });
  }
});

// 機械の削除
router.delete('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(MACHINES_FILE, 'utf-8'));
    const index = data.machines.findIndex((m: any) => m.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: '機械が見つかりません' });
    }
    
    data.machines.splice(index, 1);
    fs.writeFileSync(MACHINES_FILE, JSON.stringify(data, null, 2));
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting machine:', error);
    res.status(500).json({ error: '機械の削除に失敗しました' });
  }
});

export default router; 