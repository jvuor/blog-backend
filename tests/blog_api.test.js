const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogArray, blogsFromDB, initialUserArray, usersFromDB } = require('./test_helper')

beforeAll(async () => {
    await User.remove({})

    const userObjects = initialUserArray.map(n => new User(n))
    await Promise.all(userObjects.map(n => n.save()))

    await Blog.remove({})

    const blogObjects = initialBlogArray.map(n => new Blog(n))
    await Promise.all(blogObjects.map(n => n.save()))
})

describe('GET tests', () => {
  test('blogs are returned as json from api', async () => {
    blogResult = await blogsFromDB()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    returnedBlogs = response.body.map(m => m.title)

    expect(returnedBlogs.length).toBe(blogResult.length)
    blogResult.forEach(blog => {
      expect(returnedBlogs).toContain(blog.title)
    });
  })

  test('the first blog is by Chan-man', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0].author).toBe("Michael Chan")
  })


  test('specific note can be viewed', async () => {
    const resultAll = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogFromAll = resultAll.body[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogFromAll._id}`)
    
    const blogSpecific = resultBlog.body

    expect(blogSpecific).toEqual(blogFromAll)

  })
})

describe('POST tests', () => {
  test('a new blog can be posted', async () => {
    const newBlog = {
      title: 'Testi Blogi',
      author: 'Testi Kirjoittaja',
      url: 'www.example.com',
      likes: 23
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogs = await api.get('/api/blogs')

    const titles = allBlogs.body.map(r => r.title)

    expect(allBlogs.body.length).toBe(initialBlogArray.length + 1)
    expect(titles).toContain('Testi Blogi')
  })

  test ('POST without title fails', async () => {
    const newBlog = {
      author: 'Testi Kirjoittaja',
      url: 'www.example.com',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test ('POST without author fails', async () => {
    const newBlog = {
      title: 'Testi Blogi',
      url: 'www.example.com',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
  
  test ('POST without url fails', async () => {
    const newBlog = {
      title: 'Testi Blogi',
      author: 'Testi Kirjoittaja',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test ('in a POST without likes, the likes are set as 0', async () => {
    const newBlog = {
      title: 'Testblog 2',
      author: 'Testauthor',
      url: 'www.example.com/exampleblog',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogs = await api.get('/api/blogs')
    const testBlog = allBlogs.body.find(x => x.title === 'Testblog 2')
    savedBlog = await api
      .get(`/api/blogs/${testBlog._id}`)

    expect(savedBlog.body.author).toBe(newBlog.author)
    expect(savedBlog.body.title).toBe(newBlog.title)
    expect(savedBlog.body.url).toBe(newBlog.url)
    expect(savedBlog.body.likes).toEqual(0)

  })
})

describe('DELETE tests', () => {
  test('a blog entry can be deleted', async () => {
    const blogsBefore = await blogsFromDB()

    const blogsAPI = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const testBlogs = blogsAPI.body
    const lastId = testBlogs[testBlogs.length - 1]._id

    await api
      .delete(`/api/blogs/${lastId}`)
      .expect(204)

    const blogsAfter = await blogsFromDB()

    expect(blogsBefore.length).toBe(blogsAfter.length + 1)

  })

  test('deleting an invalid id fails', async () => {
    const blogsBefore = await blogsFromDB()

    const badId = '5b33daae80d68d376483'

    await api
      .delete(`/api/blogs/${badId}`)
      .expect(400)
    
    const blogsAfter = await blogsFromDB()

    expect(blogsBefore).toEqual(blogsAfter)
  })
})
  
describe('PUT tests', () => {
  test('changing data with a PUT request', async () => {
    const blogsBefore = await blogsFromDB()

    const blogsAPI = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const testBlogs = blogsAPI.body
    const lastId = testBlogs[testBlogs.length - 1]._id
    var newBlogData = testBlogs[testBlogs.length -1]
    console.log('newblogdate', newBlogData)
    newBlogData.likes += 10


    await api
      .put(`/api/blogs/${lastId}`)
      .send(newBlogData)
      .expect(200)

    const blogsAfter = await blogsFromDB()

    expect(blogsBefore[blogsBefore.length - 1].likes + 10)
      .toBe(blogsAfter[blogsAfter.length - 1].likes)
  })

  test('PUT-request to invalid id fails', async() => {
    const blogsBefore = await blogsFromDB()

    const badId = '5b33daae80d68d376483'

    await api
      .put(`/api/blogs/${badId}`)
      .expect(400)

    const blogsAfter = await blogsFromDB()

    expect(blogsBefore).toEqual(blogsAfter)

  })
})

describe('User api tests', () => {
  test('GET works and returns the results as JSON', async () => {
      userResult = await usersFromDB()
  
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      returnedUsers = response.body.map(m => m.name)
  
      expect(returnedUsers.length).toBe(userResult.length)
      userResult.forEach(user => {
        expect(returnedUsers).toContain(user.name)
      });
    })

  test('User can be added', async () => {
    const usersBefore = await usersFromDB()

    const newUser = {
      username: "testcuser",
      name: "Urhea Jest-mies",
      adult: false,
      password: "jestjest"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersFromDB()

    expect(usersBefore.length + 1).toBe(usersAfter.length)

  })

  test('Duplicate usernames are not allowed', async () => {
    const usersBefore = await usersFromDB()

    const duplicateUser = {
      username: "testuser",
      name: "Me Shouldfail",
      adult: true,
      password: "jestjest"
    }

    await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(500)

    const usersAfter = await usersFromDB()

    expect(usersBefore.length).toBe(usersAfter.length)
  })

  test('Too short passwords are not allowed', async () => {
    const usersBefore = await usersFromDB()

    const badPasswordUser = {
      username: "tryitout",
      name: "Will Failthough",
      adult: false,
      password: "1"
    }

    await api
      .post('/api/users')
      .send(badPasswordUser)
      .expect(500)

    const usersAfter = await usersFromDB()

    expect(usersBefore.length).toBe(usersAfter.length)
  })

  test('adult defaults to true if not given', async () => {
    const noAdultUser = {
      username: "maybeadult",
      name: "But Whoknows",
      password: "goodpassword"
    }

    const savedUser = await api
      .post('/api/users')
      .send(noAdultUser)
      .expect(201)

    expect(savedUser.body.adult).toBe(true)
  })
})

afterAll(() => {
  server.close()
})