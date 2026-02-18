import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { JWT_SECRET } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
     const { username, password } = req.body;

     if (!username || !password) {
          res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
          return;
     }

     const admin = await prisma.admin.findUnique({ where: { username } });
     if (!admin) {
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
});

export default router;
