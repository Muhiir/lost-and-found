const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveItemRecipient } = require('../utils/items');

test('resolveItemRecipient prefers populated owner id and falls back to email', () => {
  assert.equal(resolveItemRecipient({ postedBy: { _id: 'user-1', email: 'user@example.com' } }), 'user-1');
  assert.equal(resolveItemRecipient({ postedByEmail: 'owner@example.com' }), 'owner@example.com');
  assert.equal(resolveItemRecipient({ postedBy: 'owner-id' }), 'owner-id');
});
