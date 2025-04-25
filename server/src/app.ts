import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import knowledgeRoutes from './routes/knowledge';
import machinesRoutes from './routes/machines';
import failureRouter from './routes/failure';

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// データディレクトリの設定
const dataDir = path.join(__dirname, '../../data');
const knowledgeDir = path.join(dataDir, 'knowledge');
const machinesDir = path.join(dataDir, 'machines');

// ディレクトリが存在しない場合は作成
[dataDir, knowledgeDir, machinesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ファイルアップロードの設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const targetDir = path.join(dataDir, 'knowledge');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

// ルートの設定
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/machines', machinesRoutes);
app.use('/api/failure', failureRouter);

// エラーハンドリング
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

export { app }; 