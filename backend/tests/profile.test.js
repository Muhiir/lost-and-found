const test = require('node:test');
const assert = require('node:assert/strict');
const { sanitizeProfilePayload } = require('../utils/profile');

test('sanitizeProfilePayload trims and keeps known profile fields', () => {
  const result = sanitizeProfilePayload({
    fullName: '  Ada Lovelace  ',
    email: '  ADA@EXAMPLE.COM ',
    studentID: ' 12345 ',
    phone: ' 08012345678 ',
    major: ' Computer Science ',
    year: ' Fourth Year '
  });

  assert.equal(result.fullName, 'Ada Lovelace');
  assert.equal(result.email, 'ada@example.com');
  assert.equal(result.studentID, '12345');
  assert.equal(result.phone, '08012345678');
  assert.equal(result.major, 'Computer Science');
  assert.equal(result.year, 'Fourth Year');
});
