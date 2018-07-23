const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  created: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

blogSchema.statics.format = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    content: blog.content,
    created: blog.created,
    user: blog.user
  }
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog