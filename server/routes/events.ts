import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/events — public
router.get('/', async (_req: Request, res: Response) => {
     const { data, error } = await supabase
          .from('Event')
          .select('*')
          .order('id', { ascending: false });
     if (error) return res.status(500).json({ error: error.message });
     res.json(data);
});

// POST /api/events — admin only
router.post('/', authMiddleware, async (req: Request, res: Response) => {
     const { title, date, time, location, category } = req.body;
     const { data, error } = await supabase
          .from('Event')
          .insert({ title, date, time, location, category })
          .select()
          .single();
     if (error) return res.status(500).json({ error: error.message });
     res.status(201).json(data);
});

// PUT /api/events/:id — admin only
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     const { title, date, time, location, category } = req.body;
     const { data, error } = await supabase
          .from('Event')
          .update({ title, date, time, location, category })
          .eq('id', id)
          .select()
          .single();
     if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
     res.json(data);
});

// DELETE /api/events/:id — admin only
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     const { error } = await supabase.from('Event').delete().eq('id', id);
     if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
     res.json({ success: true });
});

export default router;
