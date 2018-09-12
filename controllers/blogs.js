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

const saveBlog = async (data) => {
  const blog = new Blog({
    content: data.content,
    title: data.title,
    sticky: data.sticky,
    user: data.userId
  })

  try {
    const response = await blog
      .save()
      .then(b => b.populate('user', { username: 1, name: 1 }).execPopulate())
    const formattedBlog = Blog.format(response)
    return formattedBlog
  } catch (e) {
    console.log(e)
    return false
  }
}

module.exports = { getAll, getById, saveBlog }
