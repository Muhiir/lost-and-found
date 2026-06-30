const test = require('node:test');
const assert = require('node:assert/strict');
const { canDeletePost } = require('../utils/posts');

test('canDeletePost only allows deletion by the owner', () => {
  assert.equal(canDeletePost({ userId: 'u1' }, 'u1'), true);
  assert.equal(canDeletePost({ userId: 'u1' }, 'u2'), false);
  assert.equal(canDeletePost(null, 'u1'), false);
});
