const User = require('../models/user')
const { hashPassword } = require('../utils/password')

const getAll = async () => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { author: 1, title: 1 })

    const userList = users.map(m => User.format(m))
    return userList
  } catch (e) {
    console.log(e)
    return false
  }
}

const addUser = async (data) => {
  try {
    const hashedPassword = await hashPassword(data.password)
    const newUser = new User({
      username: data.username,
      name: data.name,
      passwordHash: hashedPassword
    })
    const result = await newUser.save()
    const formattedUser = User.format(result)
    return formattedUser
  } catch (exception) {
    console.log(exception)
    throw new Error('error while saving new user')
  }
}

const getById = async (id) => {
  try {
    const user = await User.findById(id)
    const formattedUser = User.format(user)
    return formattedUser
  } catch (exc) {
    return false
  }
}

const getByUsername = async (username) => {
  try {
    const user = await User.findOne({ username: username })
    return user
  } catch (exc) {
    return false
  }
}

const addNewBlogId = async (userId, blogId) => {
  const user = await User.findById(userId)
  user.blogs = user.blogs.concat(blogId)

  await user.save()
}

const deleteBlogById = async (userId, blogId) => {
  var user = await User.findById(userId)
  user.blogs = user.blogs.filter(blog => blog.toString() !== blogId.toString())

  await user.save()
}

const checkExistingUsername = async (username) => {
  const user = await User.find({ username: username })
  if (user.length > 0) {
    return true
  } else {
    return false
  }
}

const changePassword = async (id, password) => {
  const hashedPassword = await hashPassword(password)
  await User.findByIdAndUpdate(id, { passwordHash: hashedPassword })
}

module.exports = {
  getAll,
  addUser,
  getById,
  getByUsername,
  addNewBlogId,
  deleteBlogById,
  checkExistingUsername,
  changePassword
}
