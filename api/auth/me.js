import { getUserByEmail } from '../_lib/db.js';
import { readSessionEmail } from '../_lib/session.js';

export default async function handler(req, res) {
  const email = readSessionEmail(req);
  if (!email) {
    res.status(200).json({ user: null });
    return;
  }

  try {
    const user = await getUserByEmail(email);
    res.status(200).json({ user: user ? { email: user.email } : null });
  } catch (err) {
    console.error('auth/me error:', err);
    res.status(200).json({ user: null });
  }
}
