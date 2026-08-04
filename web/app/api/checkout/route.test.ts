import { describe, it } from 'node:test';
import assert from 'node:assert';
import { POST } from './route';

describe('Checkout API Handler', () => {
  it('returns Stripe checkout session URL', async () => {
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ jobId: 'test-123' })
    });
    const res = await POST(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.url);
    assert.strictEqual(typeof data.url, 'string');
  });
});
