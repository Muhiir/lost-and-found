function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildEmailQuery(email) {
  const normalizedEmail = normalizeEmail(email);
  return {
    email: {
      $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i')
    }
  };
}

module.exports = {
  normalizeEmail,
  buildEmailQuery,
};
