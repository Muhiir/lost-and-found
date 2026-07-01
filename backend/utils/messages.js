function resolveRecipientValue(recipient) {
  if (!recipient) return '';

  if (typeof recipient === 'string') {
    return recipient.trim();
  }

  if (typeof recipient === 'object') {
    if (recipient._id) return String(recipient._id);
    if (recipient.id) return String(recipient.id);
    if (recipient.email) return String(recipient.email);
    if (recipient.studentID) return String(recipient.studentID);
  }

  return '';
}

function validateMessagePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Message payload must be an object');
  }

  const recipient = resolveRecipientValue(payload.recipient);
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
  resolveRecipientValue,
};
