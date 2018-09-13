const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)
jest.mock('../../controllers/blogs')
jest.mock('../../controllers/users')
const blogController = require('../../controllers/blogs')
const userController = require('../../controllers/users')

describe('blogRouter unit tests', () => {
  test('GET /api/blogs/ works', async () => {
    const testData = { test1: 'test1', test2: 'test2' }
    // good route - returns the full data
    blogController.getAll.mockImplementationOnce(() => testData)

    const response = await api
      .get('/api/blogs/')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual(testData)
    expect(blogController.getAll.mock.calls.length).toBe(1)
    expect(blogController.getAll.mock.calls[0]).toEqual([])

    // bad route - returns 404 if it gets falsy result from controller
    blogController.getAll.mockImplementationOnce(() => false)

    await api
      .get('/api/blogs')
      .expect(404)

    expect(blogController.getAll.mock.calls.length).toBe(2)
  })

  test('GET /api/blogs/id works', async () => {
    const testData = { testkey: 'testvalue' }
    blogController.getById.mockImplementationOnce((id) => ({ id: id, ...testData }))

    const response = await api
      .get('/api/blogs/testid')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ id: 'testid', testkey: 'testvalue' })
    expect(blogController.getById.mock.calls.length).toBe(1)
    expect(blogController.getById.mock.calls[0]).toEqual(['testid'])

    blogController.getById.mockImplementationOnce(() => false)

    const badResponse = await api
      .get('/api/blogs/otherurl')
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(badResponse.body).toEqual({ error: 'bad id' })
    expect(blogController.getById.mock.calls.length).toBe(2)
    expect(blogController.getById.mock.calls[1]).toEqual(['otherurl'])
  })
})

afterAll(() => {
  server.close()
})
