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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Missing activity ID' });
    }

    if (!authMiddleware(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (method === 'PUT') {
      const { title, description, icon, sortOrder } = req.body;
      const parsedSortOrder = Number(sortOrder);
      const payload = {
        title,
        description,
        icon,
        sortOrder: Number.isNaN(parsedSortOrder) ? 0 : parsedSortOrder,
      };

      const { data, error } = await supabase
        .from('Activity')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      if (!data) return res.status(404).json({ error: 'Activity not found' });

      return res.status(200).json(data);
    }

    if (method === 'DELETE') {
      const { error } = await supabase
        .from('Activity')
        .delete()
        .eq('id', id);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Activities [id] API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
