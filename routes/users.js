const usersRouter = require('express').Router()
const userController = require('../controllers/users')

usersRouter.post('/', async (request, response) => {
  // POST /api/users - used to create new users
  // expects JSON object attached with request with following fields:
  // { "username": "[new user's username]",
  //   "name": "[new user's displayed name]",
  //   "password": "[new user's password]"}
  try {
    const body = request.body

    if (process.env.NODE_ENV === 'production') {
      // no new users allowed from heroku api
      return response.status(403).end()
    }

    if (!body.password) {
      return response.status(400).json({ error: 'password required' })
    }
    if (!body.username) {
      return response.status(400).json({ error: 'username required' })
    }
    if (!body.name) {
      return response.status(400).json({ error: 'name required' })
    }
    if (body.password.length < 8) {
      return response.status(400).json({ error: 'password too short' })
    }

    if (await userController.checkExistingUsername(body.username)) {
      return response.status(400).json({ error: 'username already taken' })
    }

    const userData = {
      username: body.username,
      name: body.name,
      password: body.password
    }

    const savedUser = await userController.addUser(userData)

    response.status(201).json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).end()
  }
})

usersRouter.get('/', async (request, response) => {
  // GET /api/users - returns all the user data,
  // populates the response with title and id of every
  // post made by the user
  try {
    const userList = await userController.getAll()

    if (!userList) {
      return response.status(404).end()
    }

    response
      .status(200)
      .json(userList)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'error happened while getting users' })
  }
})

usersRouter.put('/:id', async (request, response) => {
  // PUT /api/users/id - changes password.
  // expects JSON object attached to the request:
  // { "password": "[new password]" }

  if (process.env.NODE_ENV === 'production') {
    // not allowed on heroku
    return response.status(403).end()
  }

  if (!request.body || !request.body.password) {
    return response.status(400).json({ error: 'new password missing' })
  }

  const newPassword = request.body.password

  if (newPassword.length < 8) {
    return response.status(400).json({ error: 'password too short' })
  }

  const id = request.params.id

  if (!request.token.verified) {
    return response.status(403).end()
  }

  if (request.token.id !== id) {
    return response.status(403).end()
  }

  try {
    await userController.changePassword(id, newPassword)
    return response.status(200).end()
  } catch (err) {
    console.log(err)
    return response.status(500).end()
  }
})

module.exports = usersRouter
