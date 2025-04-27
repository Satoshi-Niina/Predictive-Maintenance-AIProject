import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { generateToken, auth, AuthRequest } from '../middleware/auth';

const router = Router();

// ログイン
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        department: user.department,
        division: user.division,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ユーザー一覧取得（管理者のみ）
router.get('/users', auth, async (req: AuthRequest, res) => {
  try {
    // 管理者権限チェック
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: '権限がありません' });
    }

    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'department', 'division'],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ユーザー登録（管理者のみ）
router.post('/register', auth, async (req: AuthRequest, res) => {
  try {
    const { username, password, role, department, division } = req.body;

    // 管理者権限チェック
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: '権限がありません' });
    }

    // ユーザー名の重複チェック
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'このユーザー名は既に使用されています' });
    }

    // 新規ユーザー作成
    const user = await User.create({
      username,
      password,
      role,
      department,
      division,
    });

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        department: user.department,
        division: user.division,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

export default router; 