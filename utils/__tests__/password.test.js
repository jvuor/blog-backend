const password = require('../password')
jest.mock('bcrypt')
const bcrypt = require('bcrypt')

const expectedSaltRounds = 10

describe('password unit test', () => {
  test('password hashPassword unit test', async () => {
    bcrypt.hash.mockImplementationOnce(() => 'testreturn')

    const result = await password.hashPassword('test')
    expect(bcrypt.hash.mock.calls.length).toBe(1)
    expect(bcrypt.hash.mock.calls[0][0]).toBe('test')
    expect(bcrypt.hash.mock.calls[0][1]).toBe(expectedSaltRounds)
    expect(result).toBe('testreturn')
  })

  test('password checkPassword unit test', async () => {
    bcrypt.compare.mockImplementationOnce(() => 'testreturn')

    const result = await password.checkPassword('test', 'testHash')
    expect(bcrypt.compare.mock.calls.length).toBe(1)
    expect(bcrypt.compare.mock.calls[0][0]).toBe('test')
    expect(bcrypt.compare.mock.calls[0][1]).toBe('testHash')
    expect(result).toBe('testreturn')
  })
})
