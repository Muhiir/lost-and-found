const test = require('node:test');
const assert = require('node:assert/strict');
const { validateMessagePayload } = require('../utils/messages');

test('validateMessagePayload rejects empty recipient or content', () => {
  assert.throws(() => validateMessagePayload({ recipient: '', content: '   ' }), /recipient/i);
  assert.throws(() => validateMessagePayload({ recipient: 'student@example.com', content: '' }), /content/i);
});

test('validateMessagePayload keeps trimmed content', () => {
  const result = validateMessagePayload({ recipient: ' student@example.com ', content: ' Hello there ' });
  assert.equal(result.recipient, 'student@example.com');
  assert.equal(result.content, 'Hello there');
});
