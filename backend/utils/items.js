function resolveItemRecipient(item) {
  if (!item || typeof item !== 'object') return '';

  if (item.postedBy && typeof item.postedBy === 'object') {
    return item.postedBy._id || item.postedBy.id || item.postedBy.email || '';
  }

  if (item.postedBy) {
    return String(item.postedBy);
  }

  if (item.postedByEmail) {
    return String(item.postedByEmail);
  }

  return '';
}

module.exports = {
  resolveItemRecipient,
};
