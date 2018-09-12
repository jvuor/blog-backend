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

module.exports = { getById }
