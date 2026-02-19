import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/events — public
router.get('/', async (_req: Request, res: Response) => {
     try {
          const { data, error } = await supabase
               .from('Event')
               .select('*')
               .order('id', { ascending: false });
          if (error) return res.status(500).json({ error: error.message });
          res.json(data ?? []);
     } catch (err) {
          console.error('Events GET error:', err);
          res.status(500).json({ error: 'Etkinlikler alınamadı' });
     }
});

// POST /api/events — admin only
router.post('/', authMiddleware, async (req: Request, res: Response) => {
     try {
          const { title, date, time, location, category } = req.body;
          const { data, error } = await supabase
               .from('Event')
               .insert({ title, date, time, location, category })
               .select()
               .single();
          if (error) return res.status(500).json({ error: error.message });
          res.status(201).json(data);
     } catch (err) {
          console.error('Events POST error:', err);
          res.status(500).json({ error: 'Etkinlik eklenemedi' });
     }
});

// PUT /api/events/:id — admin only
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     try {
          const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          const id = Number(rawId);
          if (!rawId || Number.isNaN(id)) { res.status(400).json({ error: 'Geçersiz id' }); return; }
          const { title, date, time, location, category } = req.body;
          const { data, error } = await supabase
               .from('Event')
               .update({ title, date, time, location, category })
               .eq('id', id)
               .select()
               .single();
          if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
          res.json(data);
     } catch (err) {
          console.error('Events PUT error:', err);
          res.status(500).json({ error: 'Etkinlik güncellenemedi' });
     }
});

// DELETE /api/events/:id — admin only
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     try {
          const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          const id = Number(rawId);
          if (!rawId || Number.isNaN(id)) { res.status(400).json({ error: 'Geçersiz id' }); return; }
          const { error } = await supabase.from('Event').delete().eq('id', id);
          if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
          res.json({ success: true });
     } catch (err) {
          console.error('Events DELETE error:', err);
          res.status(500).json({ error: 'Etkinlik silinemedi' });
     }
});

export default router;
