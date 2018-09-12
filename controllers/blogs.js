const Blog = require('../models/blog')

const getAll = async () => {
  try {
    let blogList = await Blog
      .find({})
      .sort('-created') // sorted by created date
      .populate('user', { username: 1, name: 1 })
    blogList = blogList.map(blog => Blog.format(blog))
    return blogList
  } catch (exc) {
    return false
  }
}

const getById = async (id) => {
  try {
    const blog = await Blog.findById(id)
    const formattedBlog = Blog.format(blog)
    return formattedBlog
  } catch (exc) {
    return false
  }
}

module.exports = { getAll, getById }
