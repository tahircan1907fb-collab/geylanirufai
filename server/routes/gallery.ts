import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/gallery — public
router.get('/', async (_req: Request, res: Response) => {
     try {
          const { data, error } = await supabase
               .from('GalleryImage')
               .select('*')
               .order('id', { ascending: false });
          if (error) return res.status(500).json({ error: error.message });
          res.json(data ?? []);
     } catch (err) {
          console.error('Gallery GET error:', err);
          res.status(500).json({ error: 'Galeri alınamadı' });
     }
});

// POST /api/gallery — admin only
router.post('/', authMiddleware, async (req: Request, res: Response) => {
     try {
          const { src, alt, category } = req.body;
          const { data, error } = await supabase
               .from('GalleryImage')
               .insert({ src, alt, category })
               .select()
               .single();
          if (error) return res.status(500).json({ error: error.message });
          res.status(201).json(data);
     } catch (err) {
          console.error('Gallery POST error:', err);
          res.status(500).json({ error: 'Görsel eklenemedi' });
     }
});

// PUT /api/gallery/:id — admin only
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     try {
          const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          const id = Number(rawId);
          if (!rawId || Number.isNaN(id)) { res.status(400).json({ error: 'Geçersiz id' }); return; }
          const { src, alt, category } = req.body;
          const { data, error } = await supabase
               .from('GalleryImage')
               .update({ src, alt, category })
               .eq('id', id)
               .select()
               .single();
          if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
          res.json(data);
     } catch (err) {
          console.error('Gallery PUT error:', err);
          res.status(500).json({ error: 'Görsel güncellenemedi' });
     }
});

// DELETE /api/gallery/:id — admin only
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     try {
          const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          const id = Number(rawId);
          if (!rawId || Number.isNaN(id)) { res.status(400).json({ error: 'Geçersiz id' }); return; }
          const { error } = await supabase.from('GalleryImage').delete().eq('id', id);
          if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
          res.json({ success: true });
     } catch (err) {
          console.error('Gallery DELETE error:', err);
          res.status(500).json({ error: 'Görsel silinemedi' });
     }
});

export default router;
