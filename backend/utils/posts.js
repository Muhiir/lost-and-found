function canDeletePost(post, currentUserId) {
  if (!post || !currentUserId) return false;
  return String(post.userId || post.authorId || '') === String(currentUserId);
}

module.exports = {
  canDeletePost,
};
