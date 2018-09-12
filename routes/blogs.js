const blogRouter = require('express').Router()
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
    response.status(500).end()
  }
})

blogRouter.get('/:id', async (request, response) => {
  // GET /api/blogs/id - returns one blog post by id
  const id = request.params.id

  try {
    const blog = await blogController.getById(id)

    if (blog) {
      response.json(blog)
    } else {
      response.status(400).send({ error: 'bad id' })
    }
  } catch (exception) {
    console.log(exception)
    response.status(500).end()
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
      return response.status(403).end()
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

    const newBlog = await blogController.saveBlog({
      content: body.content,
      title: body.title,
      sticky: body.sticky,
      userId: postingUser.id
    })

    if (!newBlog) {
      throw new Error('Error while saving blog')
    }

    response.status(201).json(newBlog)

    await userController.addNewBlogId(newBlog.user.id, newBlog.id)
    // not sure if awaiting the above line makes a difference or not
  } catch (exception) {
    console.log(exception)
    response.status(500).end()
  }
})

blogRouter.delete('/:id', async (request, response) => {
  // DELETE /api/blogs/id - deletes a post by id
  // needs a valid JWT token
  const id = request.params.id

  try {
    if (!request.token.verified) {
      return response.status(403).end()
    }

    const blog = await blogController.getById(id)

    if (!blog) {
      return response.status(400).json({ error: 'bad id' })
    }

    if (blog.user.toString() !== request.token.id.toString()) {
      return response.status(403).end()
    }

    await blogController.deleteById(id, blog.user)

    return response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(500).end()
  }
})

blogRouter.put('/:id', async (request, response) => {
  // PUT /blogs/api/id - edits an existing blog post.
  // needs a valid JWT token
  // expects JSON object, formatting identical to POST /api/blogs
  try {
    if (!request.token.verified) {
      return response.status(403).end()
    }

    const id = request.params.id
    const blogToChange = await blogController.getById(id)

    if (!blogToChange) {
      return response.status(400).end()
    }

    if (blogToChange.user.toString() !== request.token.id) {
      return response.status(403).end()
    }

    if (!request.body.title) {
      return response.status(400).json({ error: 'title missing' })
    }

    if (!request.body.content) {
      return response.status(400).json({ error: 'content missing' })
    }

    const changedData = {
      title: request.body.title,
      content: request.body.content,
      sticky: request.body.sticky || false
    }
    const updatedBlog = await blogController.changeBlog(id, changedData)
    return response.status(200).json(updatedBlog)
  } catch (exception) {
    response.status(500).send('error while handling the request')
  }
})

module.exports = blogRouter
