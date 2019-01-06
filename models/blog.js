const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  created: { type: Date, default: Date.now },
  sticky: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: Boolean
})

blogSchema.statics.format = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    content: blog.content,
    created: blog.created,
    sticky: blog.sticky || false,
    user: blog.user,
    published: blog.published
  }
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
