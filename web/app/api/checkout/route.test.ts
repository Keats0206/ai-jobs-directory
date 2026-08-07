import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { NextRequest } from 'next/server';
import { POST } from './route';

function post(body: unknown): NextRequest {
  return new Request('http://localhost:3000/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as NextRequest;
}

describe('Checkout API Handler', () => {
  it('rejects a request missing email and company', async () => {
    const res = await POST(post({ jobId: 'test-123' }));
    const data = await res.json();

    // 503 when STRIPE_SECRET_KEY is absent, 400 when it is set and validation
    // runs. Either way the request must not be treated as a valid checkout.
    assert.ok(res.status === 400 || res.status === 503, `unexpected status ${res.status}`);
    assert.ok(data.error);
    assert.strictEqual(data.url, undefined);
  });

  it('rejects a request with a company but no email', async () => {
    const res = await POST(post({ type: 'post', company: 'Acme' }));
    const data = await res.json();

    assert.ok(res.status === 400 || res.status === 503, `unexpected status ${res.status}`);
    assert.ok(data.error);
  });
});
