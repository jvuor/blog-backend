const Blog = require('../models/blog')
const userController = require('./users')

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

const deleteById = async (id, userId = null) => {
  if (!userId) {
    userId = getById(id).user
  }

  await Blog.findByIdAndRemove(id)
  await userController.deleteBlogById(userId, id)
}

const changeBlog = async (id, newData) => {
  const updatedBlog = await Blog.findByIdAndUpdate(id, newData, { new: true })
  const formattedBlog = Blog.format(updatedBlog)
  return formattedBlog
}

module.exports = { getAll, getById, saveBlog, deleteById, changeBlog }
