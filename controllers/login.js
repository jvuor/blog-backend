const { checkPassword } = require('../utils/password')
const userController = require('./users')
const { signToken } = require('../utils/token')

const login = async (username, password) => {
  const user = await userController.getByUsername(username)

  if (!user) {
    return false
  }

  const passwordCorrect = await checkPassword(password, user.passwordHash)

  if (!passwordCorrect) {
    return false
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }
  const token = signToken(userForToken)
  return {
    token: token,
    username: user.username,
    name: user.name,
    id: user._id
  }
}

module.exports = { login }
