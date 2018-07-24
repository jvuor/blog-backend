const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .sort('-created')      //sorted by created date
      .populate('user', { username: 1, name: 1 })
    const formattedBlogs = blogs.map(Blog.format)

    if (blogs) {
      response.json(formattedBlogs)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
    response.status(500)
  }
})


blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  try {
    const blog = await Blog.findById(id)

    if (blog) {
      response.json(Blog.format(blog))
    } else {
      response.status(404).end()
    }

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformed id' })
  }
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  //checking authentication first
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    if (body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const postingUser = await User.findById(decodedToken.id)
    if (!postingUser) {
      return response.status(400).json({ error: 'invalid user' })
    }

    const blog = new Blog({
      author: body.author,
      content: body.content,
      title: body.title,
      sticky: body.sticky,
      user: postingUser._id
    })

    const blogResponse = await blog.save()
    response.status(201).json(Blog.format(blogResponse))

    const user = await User.findById(postingUser._id)
    user.blogs = user.blogs.concat(blogResponse._id)

    await user.save()

  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'error in post request' })
    }
  }
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    const blog = await Blog.findById(id)

    if (blog.user.toString() === decodedToken.id.toString()) {
      var user = await User.findById(blog.user)
      user.blogs = user.blogs.filter(blog => blog !== id)
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
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken) {
      return response.status(401).send('token missing or invalid')
    }

    const id = request.params.id
    const changedBlog = {
      author: request.body.author,
      content: request.body.content
    }
    const blogToChange = await Blog.findById(id)
    if (blogToChange.user.toString() === decodedToken.id.toString()) {
      const updatedBlog = await Blog.findByIdAndUpdate(id, changedBlog)
      return response.status(200).json(Blog.format(updatedBlog))
    } else {
      return response.status(403).send('error: wrong user')
    }
  } catch (exception) {
    response.status(500).send('error while handling the request')
  }
})

module.exports = blogRouter