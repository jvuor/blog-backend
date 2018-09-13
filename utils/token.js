const jwt = require('jsonwebtoken')

const verifyToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    return {
      verified: true,
      username: decodedToken.username,
      id: decodedToken.id.toString()
    }
  } catch (exc) {
    console.log(exc)
    return { verified: false }
  }
}

const signToken = (tokenData) => {
  const token = jwt.sign(tokenData, process.env.SECRET)
  return token
}

module.exports = { verifyToken, signToken }
