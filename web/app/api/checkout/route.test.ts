import { describe, it } from 'node:test';
import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { POST } from './route';

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('Checkout API Handler', () => {
  it('returns 400 when email or company is missing', async () => {
    const res = await POST(makeRequest({ type: 'post', email: 'a@b.com' }));
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Missing required fields');
  });

  it('returns 400 when post-mcp is missing mcpName or mcpUrl', async () => {
    const res = await POST(
      makeRequest({
        type: 'post-mcp',
        email: 'a@b.com',
        company: 'Acme',
        mcpName: 'My MCP',
      })
    );
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Missing required MCP fields');
  });

  it('returns Stripe checkout session URL when configured', async () => {
    if (!process.env.STRIPE_SECRET_KEY) {
      return;
    }

    const res = await POST(
      makeRequest({
        type: 'post',
        email: 'test@example.com',
        company: 'Acme',
        jobTitle: 'AI Engineer',
      })
    );
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.url);
    assert.strictEqual(typeof data.url, 'string');
  });

  it('returns 503 when Stripe is not configured', async () => {
    const original = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    // Re-import would be needed for module-level stripe init; skip if key is set
    if (original) {
      process.env.STRIPE_SECRET_KEY = original;
      return;
    }

    const res = await POST(
      makeRequest({
        type: 'post',
        email: 'test@example.com',
        company: 'Acme',
      })
    );
    assert.strictEqual(res.status, 503);
  });
});
