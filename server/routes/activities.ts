import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/activities — public
router.get('/', async (_req: Request, res: Response) => {
     try {
          const { data, error } = await supabase
               .from('Activity')
               .select('*')
               .order('sortOrder', { ascending: true });
          if (error) return res.status(500).json({ error: error.message });
          res.json(data ?? []);
     } catch (err) {
          console.error('Activities GET error:', err);
          res.status(500).json({ error: 'Faaliyetler alınamadı' });
     }
});

// POST /api/activities — admin only
router.post('/', authMiddleware, async (req: Request, res: Response) => {
     try {
          const { title, description, icon, sortOrder } = req.body;
          const { data, error } = await supabase
               .from('Activity')
               .insert({ title, description, icon, sortOrder: sortOrder ?? 0 })
               .select()
               .single();
          if (error) return res.status(500).json({ error: error.message });
          res.status(201).json(data);
     } catch (err) {
          console.error('Activities POST error:', err);
          res.status(500).json({ error: 'Faaliyet eklenemedi' });
     }
});

// PUT /api/activities/:id — admin only
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     try {
          const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          const id = Number(rawId);
          if (!rawId || Number.isNaN(id)) { res.status(400).json({ error: 'Geçersiz id' }); return; }
          const { title, description, icon, sortOrder } = req.body;
          const { data, error } = await supabase
               .from('Activity')
               .update({ title, description, icon, sortOrder })
               .eq('id', id)
               .select()
               .single();
          if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
          res.json(data);
     } catch (err) {
          console.error('Activities PUT error:', err);
          res.status(500).json({ error: 'Faaliyet güncellenemedi' });
     }
});

// DELETE /api/activities/:id — admin only
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
     try {
          const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          const id = Number(rawId);
          if (!rawId || Number.isNaN(id)) { res.status(400).json({ error: 'Geçersiz id' }); return; }
          const { error } = await supabase.from('Activity').delete().eq('id', id);
          if (error) { res.status(404).json({ error: 'Kayıt bulunamadı' }); return; }
          res.json({ success: true });
     } catch (err) {
          console.error('Activities DELETE error:', err);
          res.status(500).json({ error: 'Faaliyet silinemedi' });
     }
});

export default router;
