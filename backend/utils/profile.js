const { normalizeEmail } = require('./auth');

function sanitizeProfilePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Profile payload must be an object');
  }

  return {
    fullName: String(payload.fullName || '').trim(),
    email: normalizeEmail(payload.email),
    studentID: String(payload.studentID || '').trim(),
    phone: String(payload.phone || '').trim(),
    major: String(payload.major || '').trim(),
    year: String(payload.year || '').trim(),
  };
}

module.exports = {
  sanitizeProfilePayload,
};
