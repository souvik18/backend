import crypto from 'crypto';
// import path from 'path';

export function generateUniqueFileName(): string {
  const base = crypto.randomBytes(6).toString('hex');
  //const ext = path.extname(originalName);
  return `${base}`;
}
