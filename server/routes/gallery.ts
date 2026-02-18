import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/gallery — public
router.get('/', async (_req: Request, res: Response) => {
     const { data, error } = await supabase
          .from('GalleryImage')
          .select('*')
          .order('id', { ascending: false });
     if (error) return res.status(500).json({ error: error.message });
     res.json(data);
});

// POST /api/gallery — admin only
router.post('/', authMiddleware, async (req: Request, res: Response) => {
     const { src, alt, category } = req.body;
     const { data, error } = await supabase
          .from('GalleryImage')
          .insert({ src, alt, category })
          .select()
          .single();
     if (error) return res.status(500).json({ error: error.message });
     res.status(201).json(data);
});

// PUT /api/gallery/:id — admin only
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     const { src, alt, category } = req.body;
     const { data, error } = await supabase
          .from('GalleryImage')
          .update({ src, alt, category })
          .eq('id', id)
          .select()
          .single();
     if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
     res.json(data);
});

// DELETE /api/gallery/:id — admin only
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     const { error } = await supabase.from('GalleryImage').delete().eq('id', id);
     if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
     res.json({ success: true });
});

export default router;
