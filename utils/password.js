const bcrypt = require('bcrypt')

const saltRounds = 10

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

const checkPassword = async (password, passwordHash) => {
  const result = await bcrypt.compare(password, passwordHash)
  return result
}

module.exports = { hashPassword, checkPassword }
