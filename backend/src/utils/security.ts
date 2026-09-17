import crypto from 'crypto';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(':')) {
    // In case there are legacy passwords
    return password === stored;
  }
  const [salt, originalHash] = stored.split(':');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  const hashBuffer = Buffer.from(hash, 'hex');
  const originalBuffer = Buffer.from(originalHash, 'hex');
  if (hashBuffer.length !== originalBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(hashBuffer, originalBuffer);
}
