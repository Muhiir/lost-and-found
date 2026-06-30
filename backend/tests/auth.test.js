const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeEmail } = require('../utils/auth');

test('normalizeEmail trims and lowercases an email address', () => {
  assert.equal(normalizeEmail('  User@Example.COM  '), 'user@example.com');
});
