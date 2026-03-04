import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../index';
import { JWT_SECRET } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
     try {
          const { username, password } = req.body;

          if (!username || !password) {
               res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
               return;
          }

          const { data: admin, error } = await supabase
               .from('Admin')
               .select('*')
               .eq('username', username)
               .single();

          if (error || !admin) {
               res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
               return;
          }

          const isValid = await bcrypt.compare(password, admin.password);
          if (!isValid) {
               res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
               return;
          }

          const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '7d' });
          res.json({ token, username: admin.username });
     } catch (err) {
          console.error('Auth login error:', err);
          res.status(500).json({ error: 'Giriş işlemi sırasında hata oluştu' });
     }
});

// PUT /api/auth/change-password — admin only
router.put('/change-password', async (req: Request, res: Response): Promise<void> => {
     try {
          const authHeader = req.headers.authorization;
          if (!authHeader?.startsWith('Bearer ')) {
               res.status(401).json({ error: 'Token gerekli' });
               return;
          }

          const jwt = await import('jsonwebtoken');
          const decoded = jwt.default.verify(authHeader.split(' ')[1], JWT_SECRET) as { id: number };

          const { currentPassword, newPassword } = req.body;
          if (!currentPassword || !newPassword) {
               res.status(400).json({ error: 'Mevcut şifre ve yeni şifre gerekli' });
               return;
          }
          if (newPassword.length < 6) {
               res.status(400).json({ error: 'Yeni şifre en az 6 karakter olmalıdır' });
               return;
          }

          const { data: admin, error } = await supabase
               .from('Admin')
               .select('*')
               .eq('id', decoded.id)
               .single();

          if (error || !admin) {
               res.status(404).json({ error: 'Kullanıcı bulunamadı' });
               return;
          }

          const isValid = await bcrypt.compare(currentPassword, admin.password);
          if (!isValid) {
               res.status(401).json({ error: 'Mevcut şifre yanlış' });
               return;
          }

          const hashed = await bcrypt.hash(newPassword, 10);
          const { error: updateErr } = await supabase
               .from('Admin')
               .update({ password: hashed })
               .eq('id', decoded.id);

          if (updateErr) throw updateErr;
          res.json({ success: true, message: 'Şifre başarıyla değiştirildi' });
     } catch (err) {
          console.error('Change password error:', err);
          res.status(500).json({ error: 'Şifre değiştirme sırasında hata oluştu' });
     }
});

export default router;
