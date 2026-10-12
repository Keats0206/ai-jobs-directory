import { createHmac, timingSafeEqual } from 'node:crypto';
export type Subscription = { email: string; expires: number };
export function validEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}
export function createSubscriptionToken(email: string, secret: string, now = Date.now()) {
  const expires = (Math.floor(now / 86400000) + 2) * 86400000;
  const payload = Buffer.from(JSON.stringify({ email: email.trim().toLowerCase(), expires })).toString('base64url');
  return `${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`;
}
export function readSubscriptionToken(token: string, secret: string, now = Date.now()): Subscription | null {
  try {
    if (token.length > 1500) return null;
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;
    const expected = createHmac('sha256', secret).update(payload).digest();
    const actual = Buffer.from(signature, 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Subscription;
    if (!validEmail(decoded.email) || !Number.isFinite(decoded.expires) || decoded.expires <= now) return null;
    return { email: decoded.email, expires: decoded.expires };
  } catch { return null; }
}
