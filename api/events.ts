import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

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
    const { data, error } = await supabase
      .from('Event')
      .select('*')
      .order('id', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // Admin authentication check for POST, PUT, DELETE
  if (!authMiddleware(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (method === 'POST') {
    const { title, date, time, location, category } = req.body;

    // Validate required fields
    if (!title || !date || !time || !location || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('Event')
      .insert({ title, date, time, location, category })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  // For PUT and DELETE, we need the ID, which is handled in a separate dynamic route file or parsed from query if using query params.
  // However, Vercel file-based routing encourages separating by file structure.
  // Since we are inside api/events.ts, we handle collection operations.
  // Individual item operations should be in api/events/[id].ts

  return res.status(405).json({ error: 'Method not allowed' });
}
