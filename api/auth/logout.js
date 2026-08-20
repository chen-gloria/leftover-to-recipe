import { clearSessionCookie } from '../_lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  clearSessionCookie(res);
  res.status(200).json({ ok: true });
}
