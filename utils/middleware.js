const { verifyToken } = require('./token')

const logger = (request, response, next) => {
  if (process.env.NODE_ENV === 'test' && process.env.NODE_LOGGING !== 'true') {
    return next()
  }
  console.log('Method:', request.method, 'Path:', request.path, 'Body:', request.path === '/api/login' ? '--' : request.body)
  next()
}

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    request.token = verifyToken(token)
    console.log('token status: ', request.token)
  } else {
    request.token = { verified: false }
  }
  next()
}

module.exports = {
  logger,
  error,
  tokenExtractor
}
