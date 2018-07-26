const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (!body.password) {
      return response.status(400).json({ error: 'password required'})
    }
    if (!body.username) {
      return response.status(400).json({ error: 'username required'})
    }
    if (!body.name) {
      return response.status(400).json({ error: 'name required'})
    }
    if (body.password.length < 8) {
      return response.status(400).json({ error: 'password too short' })
    }

    const oldUser = await User.find({ username: body.username })
    console.log('olduser:', oldUser)
    if (oldUser.length > 0) {
      return response.status(400).json({ error: 'username already taken' })
    }

    const saltRounds = 10
    console.log('password:', body.password)
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
  try {
    const users = await User
      .find({})
      .populate('blogs', { author: 1, content: 1, title: 1 })

    const userList = users.map(m => User.format(m))

    response
      .status(200)
      .json(userList)

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'error happened while getting users' })
  }
})

module.exports = usersRouter