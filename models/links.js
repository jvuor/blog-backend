const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema({
  url: String,
  description: String,
  added: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

linkSchema.statics.format = (link) => ({
  id: link._id,
  url: link.url,
  description: link.description,
  added: link.added,
  user: link.user
})

const Link = mongoose.model('Link', linkSchema)

module.exports = Link
