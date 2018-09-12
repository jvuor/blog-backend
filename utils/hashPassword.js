const bcrypt = require('bcrypt')

const saltRounds = 10

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

module.exports = hashPassword
