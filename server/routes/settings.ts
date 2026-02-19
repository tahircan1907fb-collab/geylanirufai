import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/settings — public
router.get('/', async (_req: Request, res: Response) => {
     try {
          const { data, error } = await supabase
               .from('SiteSettings')
               .select('*')
               .eq('id', 1)
               .single();

          if (error && error.code === 'PGRST116') {
               const { data: created, error: createErr } = await supabase
                    .from('SiteSettings')
                    .insert({ id: 1 })
                    .select()
                    .single();
               if (createErr) throw createErr;
               return res.json(created);
          }
          if (error) throw error;
          res.json(data);
     } catch (error) {
          console.error('Settings fetch error:', error);
          res.status(500).json({ error: 'Failed to fetch settings', details: String(error) });
     }
});

// PUT /api/settings — admin only
router.put('/', authMiddleware, async (req: Request, res: Response) => {
     try {
          const { id, ...updateData } = req.body;
          const { data: existing } = await supabase
               .from('SiteSettings')
               .select('id')
               .eq('id', 1)
               .single();

          let result;
          if (existing) {
               const { data, error } = await supabase
                    .from('SiteSettings')
                    .update(updateData)
                    .eq('id', 1)
                    .select()
                    .single();
               if (error) throw error;
               result = data;
          } else {
               const { data, error } = await supabase
                    .from('SiteSettings')
                    .insert({ id: 1, ...updateData })
                    .select()
                    .single();
               if (error) throw error;
               result = data;
          }
          res.json(result);
     } catch (error) {
          console.error('Settings update error:', error);
          res.status(500).json({
               error: 'Failed to update settings',
               details: error instanceof Error ? error.message : String(error)
          });
     }
});

export default router;
