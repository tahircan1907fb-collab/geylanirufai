import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/settings — public
router.get('/', async (_req: Request, res: Response) => {
     try {
          let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
          if (!settings) {
               settings = await prisma.siteSettings.create({ data: { id: 1 } });
          }
          res.json(settings);
     } catch (error) {
          console.error('Settings fetch error:', error);
          res.status(500).json({ error: 'Failed to fetch settings', details: String(error) });
     }
});

// PUT /api/settings — admin only (temp: no auth for testing)
router.put('/', async (req: Request, res: Response) => {
     try {
          const { id, ...data } = req.body;
          console.log('Updating settings with data:', data);
          const settings = await prisma.siteSettings.upsert({
               where: { id: 1 },
               update: data,
               create: { id: 1, ...data },
          });
          res.json(settings);
     } catch (error) {
          console.error('Settings update error:', error);
          res.status(500).json({ error: 'Failed to update settings', details: String(error) });
     }
});

export default router;
