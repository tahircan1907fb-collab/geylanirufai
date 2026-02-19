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

export default router;
