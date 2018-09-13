const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)
jest.mock('../../controllers/login')
const loginController = require('../../controllers/login')

describe('loginRouter unit tests', () => {
  test('succesful login works', async () => {
    loginController.login.mockImplementationOnce(() => ({ test: 'test' }))
    const response = await api
      .post('/api/login')
      .send({ password: 'testpw', username: 'testun' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({ test: 'test' })
    expect(loginController.login.mock.calls.length).toBe(1)
    expect(loginController.login.mock.calls[0]).toEqual(['testun', 'testpw'])
  })

  test('failed login works', async () => {
    loginController.login.mockImplementationOnce(() => false)
    const response = await api
      .post('/api/login')
      .send({ password: 'test', username: 'test' })
      .expect(401)

    expect(response.body).toEqual({})
  })

  test('login attempts without username or password fail', async () => {
    await api
      .post('/api/login')
      .send()
      .expect(400)

    await api
      .post('/api/login')
      .send({ username: 'test' })
      .expect(400)

    await api
      .post('/api/login')
      .send({ password: 'test' })
      .expect(400)
  })
})

afterAll(() => {
  server.close()
})
