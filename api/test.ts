import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
     return res.json({ status: 'API is working', timestamp: new Date().toISOString() });
}
