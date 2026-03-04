import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/contact — public (form submit)
router.post('/', async (req: Request, res: Response): Promise<void> => {
     try {
          const { name, surname, email, subject, message } = req.body;

          if (!name || !email || !message) {
               res.status(400).json({ error: 'Ad, e-posta ve mesaj alanları zorunludur' });
               return;
          }

          const { data, error } = await supabase
               .from('ContactMessages')
               .insert({ name, surname: surname || '', email, subject: subject || '', message })
               .select()
               .single();

          if (error) throw error;
          res.status(201).json({ success: true, id: data.id });
     } catch (err) {
          console.error('Contact submit error:', err);
          res.status(500).json({ error: 'Mesaj gönderilirken hata oluştu' });
     }
});

// GET /api/contact — admin only
router.get('/', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
     try {
          const { data, error } = await supabase
               .from('ContactMessages')
               .select('*')
               .order('created_at', { ascending: false });

          if (error) throw error;
          res.json(data || []);
     } catch (err) {
          console.error('Contact list error:', err);
          res.status(500).json({ error: 'Mesajlar alınırken hata oluştu' });
     }
});

// GET /api/contact/unread-count — admin only
router.get('/unread-count', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
     try {
          const { count, error } = await supabase
               .from('ContactMessages')
               .select('*', { count: 'exact', head: true })
               .eq('is_read', false);

          if (error) throw error;
          res.json({ count: count || 0 });
     } catch (err) {
          console.error('Unread count error:', err);
          res.status(500).json({ error: 'Sayım hatası' });
     }
});

// PATCH /api/contact/:id — admin only (mark read/unread)
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
     try {
          const { id } = req.params;
          const { is_read } = req.body;

          const { data, error } = await supabase
               .from('ContactMessages')
               .update({ is_read })
               .eq('id', Number(id))
               .select()
               .single();

          if (error) throw error;
          res.json(data);
     } catch (err) {
          console.error('Contact update error:', err);
          res.status(500).json({ error: 'Güncelleme hatası' });
     }
});

// DELETE /api/contact/:id — admin only
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
     try {
          const { id } = req.params;
          const { error } = await supabase
               .from('ContactMessages')
               .delete()
               .eq('id', Number(id));

          if (error) throw error;
          res.json({ success: true });
     } catch (err) {
          console.error('Contact delete error:', err);
          res.status(500).json({ error: 'Silme hatası' });
     }
});

export default router;
