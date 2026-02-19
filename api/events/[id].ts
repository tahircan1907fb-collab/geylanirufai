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
     const { id } = req.query; // Vercel passes dynamic path segment as query param

     if (!id) {
          return res.status(400).json({ error: 'Missing event ID' });
     }

     // Admin authentication check for PUT, DELETE
     if (!authMiddleware(req)) {
          return res.status(401).json({ error: 'Unauthorized' });
     }

     if (method === 'PUT') {
          const { title, date, time, location, category } = req.body;

          // Validate required fields
          if (!title || !date || !time || !location || !category) {
               return res.status(400).json({ error: 'Missing required fields' });
          }

          const { data, error } = await supabase
               .from('Event')
               .update({ title, date, time, location, category })
               .eq('id', id)
               .select()
               .single();

          if (error) return res.status(500).json({ error: error.message });
          if (!data) return res.status(404).json({ error: 'Event not found' });

          return res.status(200).json(data);
     }

     if (method === 'DELETE') {
          const { error } = await supabase
               .from('Event')
               .delete()
               .eq('id', id);

          if (error) return res.status(500).json({ error: error.message });
          return res.status(200).json({ success: true });
     }

     return res.status(405).json({ error: 'Method not allowed' });
}
