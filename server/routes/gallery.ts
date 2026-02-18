import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/gallery — public
router.get('/', async (_req: Request, res: Response) => {
     const items = await prisma.galleryImage.findMany({ orderBy: { id: 'desc' } });
     res.json(items);
});

// POST /api/gallery — admin only
router.post('/', authMiddleware, async (req: Request, res: Response) => {
     const { src, alt, category } = req.body;
     const item = await prisma.galleryImage.create({ data: { src, alt, category } });
     res.status(201).json(item);
});

// PUT /api/gallery/:id — admin only
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     const { src, alt, category } = req.body;
     try {
          const item = await prisma.galleryImage.update({ where: { id }, data: { src, alt, category } });
          res.json(item);
     } catch {
          res.status(404).json({ error: 'Kayıt bulunamadı' });
     }
});

// DELETE /api/gallery/:id — admin only
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     try {
          await prisma.galleryImage.delete({ where: { id } });
          res.json({ success: true });
     } catch {
          res.status(404).json({ error: 'Kayıt bulunamadı' });
     }
});

export default router;
