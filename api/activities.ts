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
    const items = await prisma.activity.findMany({ orderBy: { sortOrder: 'asc' } });
    return res.json(items);
  }

  if (!authMiddleware(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (method === 'POST') {
    const { title, description, icon, sortOrder } = req.body;
    const item = await prisma.activity.create({ 
      data: { title, description, icon, sortOrder: sortOrder ?? 0 } 
    });
    return res.status(201).json(item);
  }

  if (method === 'PUT') {
    const id = parseInt(req.query.id as string);
    const { title, description, icon, sortOrder } = req.body;
    try {
      const item = await prisma.activity.update({ where: { id }, data: { title, description, icon, sortOrder } });
      return res.json(item);
    } catch {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }
  }

  if (method === 'DELETE') {
    const id = parseInt(req.query.id as string);
    try {
      await prisma.activity.delete({ where: { id } });
      return res.json({ success: true });
    } catch {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
