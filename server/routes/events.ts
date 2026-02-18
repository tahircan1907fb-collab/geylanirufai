import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/events — public
router.get('/', async (_req: Request, res: Response) => {
     const items = await prisma.event.findMany({ orderBy: { id: 'desc' } });
     res.json(items);
});

// POST /api/events — admin only
router.post('/', authMiddleware, async (req: Request, res: Response) => {
     const { title, date, time, location, category } = req.body;
     const item = await prisma.event.create({ data: { title, date, time, location, category } });
     res.status(201).json(item);
});

// PUT /api/events/:id — admin only
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     const { title, date, time, location, category } = req.body;
     try {
          const item = await prisma.event.update({ where: { id }, data: { title, date, time, location, category } });
          res.json(item);
     } catch {
          res.status(404).json({ error: 'Kayıt bulunamadı' });
     }
});

// DELETE /api/events/:id — admin only
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     try {
          await prisma.event.delete({ where: { id } });
          res.json({ success: true });
     } catch {
          res.status(404).json({ error: 'Kayıt bulunamadı' });
     }
});

export default router;
