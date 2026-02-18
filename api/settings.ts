import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function authMiddleware(req: VercelRequest): boolean {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  if (method === 'GET') {
    try {
      let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
      if (!settings) {
        settings = await prisma.siteSettings.create({ data: { id: 1 } });
      }
      return res.json(settings);
    } catch (error) {
      console.error('Settings fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch settings', details: String(error) });
    }
  }

  if (!authMiddleware(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (method === 'PUT') {
    try {
      const { id, ...data } = req.body;
      const settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data },
      });
      return res.json(settings);
    } catch (error) {
      console.error('Settings update error:', error);
      return res.status(500).json({ error: 'Failed to update settings', details: String(error) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
