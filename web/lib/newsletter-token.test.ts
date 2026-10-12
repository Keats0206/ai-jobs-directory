import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSubscriptionToken, readSubscriptionToken, validEmail } from './newsletter-token';
const secret = 'test-secret-with-at-least-thirty-two-characters';
const now = Date.parse('2026-10-12T12:00:00Z');
test('confirmation binds the normalized email', () => {
  const token = createSubscriptionToken('PERSON@example.com', secret, now);
  assert.equal(readSubscriptionToken(token, secret, now)?.email, 'person@example.com');
});
test('tampered, expired, and incorrectly signed confirmations fail', () => {
  const token = createSubscriptionToken('person@example.com', secret, now);
  assert.equal(readSubscriptionToken(token.replace(/^./, 'A'), secret, now), null);
  assert.equal(readSubscriptionToken(token, 'different-key', now), null);
  assert.equal(readSubscriptionToken(token, secret, now + 3 * 86400000), null);
});
test('same-day retries use the same token for provider idempotency', () => {
  assert.equal(createSubscriptionToken('a@example.com', secret, now), createSubscriptionToken('a@example.com', secret, now + 1000));
});
test('rejects malformed addresses and oversized values', () => {
  for (const value of ['bad', '<user>@example.com', 'a\nb@example.com', 'a'.repeat(255)+'@example.com', null]) assert.equal(validEmail(value), false);
});
