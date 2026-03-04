import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'geylani-rufai-admin-secret-key-2026';

export interface AuthRequest extends Request {
     adminId?: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
     const authHeader = req.headers.authorization;
     if (!authHeader?.startsWith('Bearer ')) {
          res.status(401).json({ error: 'Token gerekli' });
          return;
     }

     try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
          req.adminId = decoded.id;
          next();
     } catch {
          res.status(401).json({ error: 'Geçersiz token' });
     }
}

export { JWT_SECRET };
