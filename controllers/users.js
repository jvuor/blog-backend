const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const saltRounds = 10

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
      return response.status(403).json({ error: 'forbidden' })
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

    const oldUser = await User.find({ username: body.username })
    if (oldUser.length > 0) {
      return response.status(400).json({ error: 'username already taken' })
    }

    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    var user = new User({
      username: body.username,
      name: body.name,
      passwordHash: passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'error happened' })
  }
})

usersRouter.get('/', async (request, response) => {
  // GET /api/users - returns all the user data,
  // populates the response with title and id of every
  // post made by the user
  try {
    const users = await User
      .find({})
      .populate('blogs', { author: 1, title: 1 })

    const userList = users.map(m => User.format(m))

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
    return response.status(403).json({ error: 'forbidden' })
  }

  if (!request.body || !request.body.password) {
    return response.status(400).json({ error: 'new password missing' })
  }

  const newPassword = request.body.password

  if (newPassword.length < 8) {
    return response.status(400).json({ error: 'password too short' })
  }

  const id = request.params.id
  let user

  try {
    user = await User.findById(id)
  } catch (err) {
    console.log(err)
    return response.status(400).json({ error: 'bad user id' })
  }

  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)
  const newUserData = { passwordHash: newPasswordHash, ...User.format(user) }
  await User.findByIdAndUpdate(id, newUserData)
  return response.status(200).end()
})

module.exports = usersRouter
