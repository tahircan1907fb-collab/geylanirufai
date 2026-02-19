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
  try {
    const { method } = req;

    if (method === 'GET') {
      const { data, error } = await supabase
        .from('Event')
        .select('*')
        .order('id', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data ?? []);
    }

    if (!authMiddleware(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (method === 'POST') {
      const { title, date, time, location, category } = req.body;
      const { data, error } = await supabase
        .from('Event')
        .insert({ title, date, time, location, category })
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Events API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
