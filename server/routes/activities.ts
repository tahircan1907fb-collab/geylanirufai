import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/activities — public
router.get('/', async (_req: Request, res: Response) => {
     const { data, error } = await supabase
          .from('Activity')
          .select('*')
          .order('sortOrder', { ascending: true });
     if (error) return res.status(500).json({ error: error.message });
     res.json(data);
});

// POST /api/activities — admin only
router.post('/', authMiddleware, async (req: Request, res: Response) => {
     const { title, description, icon, sortOrder } = req.body;
     const { data, error } = await supabase
          .from('Activity')
          .insert({ title, description, icon, sortOrder: sortOrder ?? 0 })
          .select()
          .single();
     if (error) return res.status(500).json({ error: error.message });
     res.status(201).json(data);
});

// PUT /api/activities/:id — admin only
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     const { title, description, icon, sortOrder } = req.body;
     const { data, error } = await supabase
          .from('Activity')
          .update({ title, description, icon, sortOrder })
          .eq('id', id)
          .select()
          .single();
     if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
     res.json(data);
});

// DELETE /api/activities/:id — admin only
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     const id = parseInt(req.params.id);
     const { error } = await supabase.from('Activity').delete().eq('id', id);
     if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
     res.json({ success: true });
});

export default router;
