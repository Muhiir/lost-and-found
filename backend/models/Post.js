const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postedByEmail: String,
  postedByName: String,
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  date: { type: String, default: () => new Date().toLocaleString() }
});

module.exports = mongoose.model('Post', postSchema);