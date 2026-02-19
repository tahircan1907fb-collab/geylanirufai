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
        .from('Activity')
        .select('*')
        .order('sortOrder', { ascending: true });
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data ?? []);
    }

    if (!authMiddleware(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (method === 'POST') {
      const { title, description, icon, sortOrder } = req.body;
      const parsedSortOrder = Number(sortOrder);
      const payload = {
        title,
        description,
        icon,
        sortOrder: Number.isNaN(parsedSortOrder) ? 0 : parsedSortOrder
      };

      let { data, error } = await supabase
        .from('Activity')
        .insert(payload)
        .select()
        .single();

      if (error?.code === '23505' && error.message.includes('Activity_pkey')) {
        const { data: lastRow, error: lastRowError } = await supabase
          .from('Activity')
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lastRowError) return res.status(500).json({ error: lastRowError.message });

        const nextId = (lastRow?.id ?? 0) + 1;
        const retry = await supabase
          .from('Activity')
          .insert({ ...payload, id: nextId })
          .select()
          .single();

        data = retry.data;
        error = retry.error;
      }

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    }

    if (method === 'PUT') {
      const id = parseInt(req.query.id as string);
      const { title, description, icon, sortOrder } = req.body;
      const { data, error } = await supabase
        .from('Activity')
        .update({ title, description, icon, sortOrder })
        .eq('id', id)
        .select()
        .single();
      if (error) return res.status(404).json({ error: 'Kayıt bulunamadı' });
      return res.json(data);
    }

    if (method === 'DELETE') {
      const id = parseInt(req.query.id as string);
      const { error } = await supabase.from('Activity').delete().eq('id', id);
      if (error) return res.status(404).json({ error: 'Kayıt bulunamadı' });
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Activities API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
