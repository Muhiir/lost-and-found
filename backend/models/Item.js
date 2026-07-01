const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: String,
  category: String,
  image: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postedByEmail: String,
  postedByName: String,
  date: { type: String, default: () => new Date().toLocaleString() }
});

module.exports = mongoose.model('Item', itemSchema);