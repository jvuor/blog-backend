const User = require('../models/user')

const getById = async (id) => {
  try {
    const user = await User.findById(id)
    const formattedUser = User.format(user)
    return formattedUser
  } catch (exc) {
    return false
  }
}

const addNewBlogId = async (userId, blogId) => {
  const user = await User.findById(userId)
  user.blogs = user.blogs.concat(blogId)

  await user.save()
}

module.exports = { getById, addNewBlogId }
