function validateMessagePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Message payload must be an object');
  }

  const recipient = String(payload.recipient || '').trim();
  const content = String(payload.content || '').trim();

  if (!recipient) {
    throw new Error('recipient is required');
  }

  if (!content) {
    throw new Error('content is required');
  }

  return { recipient, content };
}

module.exports = {
  validateMessagePayload,
};
