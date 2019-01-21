const linkRouter = require('express').Router()
const linkController = require('../controllers/links')
const userController = require('../controllers/users')

linkRouter.get('/', async (request, response) => {
  // GET /api/links - returns all saved links
  try {
    const links = await linkController.getAll()

    if (links) {
      response.json(links)
    } else {
      response.status(204).end()
    }
  } catch (exc) {
    console.log(exc)
    response.status(500).end()
  }
})

linkRouter.post('/', async (request, response) => {
  // PUT /api/links - adds a new saved link
  // needs a valid JWT token
  try {
    if (!request.token.verified) {
      return response.status(403).end()
    }

    const body = request.body

    if (!body.url) {
      return response.status(400).json('Url required')
    }

    if (!body.description) {
      return response.status(400).json('description required')
    }

    const user = await userController.getById(request.token.id)

    if (!user) {
      return response.status(403).json({ error: 'invalid user' })
    }

    const newLink = await linkController.addLink({
      url: body.url,
      description: body.description,
      userId: user.id
    })

    response.status(201).json(newLink)
  } catch (exc) {
    console.log(exc)
    response.status(500).end()
  }
})

module.exports = linkRouter
