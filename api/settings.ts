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
      return res.json(data);
    }

    if (!authMiddleware(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (method === 'PUT') {
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
      return res.json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Settings API error:', err);
    return res.status(500).json({
      error: 'Settings operation failed',
      details: err instanceof Error ? err.message : String(err)
    });
  }
}
