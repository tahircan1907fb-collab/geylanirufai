import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const TOKEN_EXPIRY = '7d';

const supabase = createClient(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!,
     { auth: { persistSession: false, autoRefreshToken: false } }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
     if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
     }

     const { username, password } = req.body;

     if (!username || !password) {
          return res.status(400).json({ error: 'Kullanıcı adı ve şifre gereklidir' });
     }

     const { data: user, error } = await supabase
          .from('Admin')
          .select('*')
          .eq('username', username)
          .single();

     if (error || !user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
     }

     const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
     return res.json({ token, username: user.username });
}
