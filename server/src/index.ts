import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import User from './models/User';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 認証ルート
app.use('/api/auth', authRoutes);

// データベースの初期化と管理者ユーザーの作成
const initializeDatabase = async () => {
  try {
    await sequelize.sync();

    // 管理者ユーザーが存在しない場合のみ作成
    const adminExists = await User.findOne({ where: { username: 'niina' } });
    if (!adminExists) {
      await User.create({
        username: 'niina',
        password: '0077',
        role: 'admin',
        department: 'システム管理部',
        division: 'IT部門',
      });
      console.log('管理者ユーザーを作成しました');
    }
  } catch (error) {
    console.error('データベースの初期化に失敗しました:', error);
  }
};

initializeDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 