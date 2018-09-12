const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const blogController = require('../controllers/blogs')
const userController = require('../controllers/users')

blogRouter.get('/', async (request, response) => {
  // GET /api/blogs - returns all blog posts
  try {
    const blogs = await blogController.getAll()

    if (blogs) {
      response.json(blogs)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
    response.status(500)
  }
})

blogRouter.get('/:id', async (request, response) => {
  // GET /api/blogs/id - returns one blog post by id
  const id = request.params.id

  try {
    const blog = await blogController.getById(id)

    if (blog) {
      response.json(Blog.format(blog))
    } else {
      response.status(400).send({ error: 'bad id' })
    }
  } catch (exception) {
    console.log(exception)
    response.status(500)
  }
})

blogRouter.post('/', async (request, response) => {
  // POST /api/blogs - adds a new blog post.
  // needs a valid JWT token
  // expects a JSON object:
  // { "title": "[title of the post]",
  //   "content": "[content of the post]",
  //   "sticky": "boolean, mark the post important or not. optional, but recommended." }
  const body = request.body

  try {
    if (!request.token.verified) {
      return response.status(403)
    }
    if (body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const postingUser = await userController.getById(request.token.id)

    if (!postingUser) {
      return response.status(403).json({ error: 'invalid user' })
    }

    const blog = new Blog({
      content: body.content,
      title: body.title,
      sticky: body.sticky,
      user: postingUser.id
    })

    const blogResponse = await blog.save().then(b => b.populate('user', { username: 1, name: 1 }).execPopulate())
    response.status(201).json(Blog.format(blogResponse))

    const user = await User.findById(postingUser._id)
    user.blogs = user.blogs.concat(blogResponse._id)

    await user.save()
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'error in post request' })
  }
})

blogRouter.delete('/:id', async (request, response) => {
  // DELETE /api/blogs/id - deletes a post by id
  // needs a valid JWT token
  const id = request.params.id

  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    const blog = await Blog.findById(id)

    if (blog.user.toString() === decodedToken.id.toString()) {
      var user = await User.findById(blog.user)
      user.blogs = user.blogs.filter(blog => blog.toString() !== id.toString())

      await user.save()
      await Blog.findByIdAndRemove(id)

      return response
        .status(204)
        .end()
    }

    return response
      .status(401)
      .send({ error: 'bad or missing token' })
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      response.status(400).send({ error: 'bad id' })
    }
  }
})

blogRouter.put('/:id', async (request, response) => {
  // PUT /blogs/api/id - edits an existing blog post.
  // needs a valid JWT token
  // expects JSON object, formatting identical to POST /api/blogs
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken) {
      return response.status(401).send('token missing or invalid')
    }

    const id = request.params.id
    const changedBlog = {
      title: request.body.title,
      content: request.body.content,
      sticky: request.body.sticky
    }
    const blogToChange = await Blog.findById(id)
    if (blogToChange.user.toString() === decodedToken.id.toString()) {
      const updatedBlog = await Blog.findByIdAndUpdate(id, changedBlog, { new: true })
      return response.status(200).json(Blog.format(updatedBlog))
    } else {
      return response.status(403).send('error: wrong user')
    }
  } catch (exception) {
    response.status(500).send('error while handling the request')
  }
})

module.exports = blogRouter
