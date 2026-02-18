import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/activities — public
router.get('/', async (_req: Request, res: Response) => {
     const items = await prisma.activity.findMany({ orderBy: { sortOrder: 'asc' } });
     res.json(items);
});

// POST /api/activities — admin only
router.post('/', authMiddleware, async (req: Request, res: Response) => {
     const { title, description, icon, sortOrder } = req.body;
     const item = await prisma.activity.create({ data: { title, description, icon, sortOrder: sortOrder ?? 0 } });
     res.status(201).json(item);
});

// PUT /api/activities/:id — admin only
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     const { title, description, icon, sortOrder } = req.body;
     try {
          const item = await prisma.activity.update({ where: { id }, data: { title, description, icon, sortOrder } });
          res.json(item);
     } catch {
          res.status(404).json({ error: 'Kayıt bulunamadı' });
     }
});

// DELETE /api/activities/:id — admin only
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     try {
          await prisma.activity.delete({ where: { id } });
          res.json({ success: true });
     } catch {
          res.status(404).json({ error: 'Kayıt bulunamadı' });
     }
});

export default router;
