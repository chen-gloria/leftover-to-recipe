import { findOrCreateUser } from '../_lib/db.js';
import { issueSessionCookie } from '../_lib/session.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const email = String(req.body?.email || '')
    .trim()
    .toLowerCase();

  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ message: 'Please enter a valid email address.' });
    return;
  }

  try {
    const user = await findOrCreateUser(email);
    issueSessionCookie(res, user.email);
    res.status(200).json({ user: { email: user.email } });
  } catch (err) {
    console.error('auth/login error:', err);
    res.status(500).json({ message: 'Could not sign you in right now. Please try again.' });
  }
}
