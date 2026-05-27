import User from './models/User.js';

export async function ensureSeedAdmin() {
  const email = process.env.ADMIN_DEFAULT_EMAIL;
  const password = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!email || !password) return;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return;

  const passwordHash = await User.hashPassword(password);
  await User.create({ email, passwordHash, name: 'Admin', role: 'admin' });
  console.log(`Seed admin created: ${email} / ${password}  (change password after first login)`);
}
