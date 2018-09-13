const loginRouter = require('express').Router()
const loginController = require('../controllers/login')

loginRouter.post('/', async (request, response) => {
  // POST /api/login - returns a jwt when given valid user credentials
  // expect JSON object:
  // { "username": "[username]",
  //   "password": "[password]"}
  const body = request.body

  if (!body.password || !body.username) {
    return response.status(400).end()
  }

  const loginAllowed = await loginController.login(body.username, body.password)

  if (!loginAllowed) {
    return response.status(401).end()
  }

  response.status(200).send(loginAllowed)
})

module.exports = loginRouter
