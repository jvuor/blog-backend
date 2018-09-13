const token = require('../token')
jest.mock('jsonwebtoken')
const jwt = require('jsonwebtoken')

describe('token unit tests', () => {
  test('signToken unit tests', async () => {
    jwt.sign.mockImplementationOnce(() => 'testreturn')
    const testToken = 'testToken'
    const result = token.signToken(testToken)
    expect(jwt.sign.mock.calls.length).toBe(1)
    expect(jwt.sign.mock.calls[0][0]).toBe('testToken')
    expect(jwt.sign.mock.calls[0][1]).toBe(process.env.SECRET)
    expect(result).toBe('testreturn')
  })

  test('verifyToken unit tests', () => {
    // the succesful path
    jwt.verify.mockImplementationOnce(() => ({
      username: 'testusername',
      id: 1234
    }))
    const result = token.verifyToken('testToken')
    expect(jwt.verify.mock.calls.length).toBe(1)
    expect(jwt.verify.mock.calls[0][0]).toBe('testToken')
    expect(jwt.verify.mock.calls[0][1]).toBe(process.env.SECRET)
    const expectedResult = {
      verified: true,
      username: 'testusername',
      id: '1234'
    }
    expect(result).toEqual(expectedResult)

    // error path
    jwt.verify.mockReset()
    jwt.verify.mockImplementationOnce(() => { throw Error('oops') })
    const badResult = token.verifyToken('testToken 2')
    expect(jwt.verify.mock.calls.length).toBe(1)
    expect(jwt.verify.mock.calls[0][0]).toBe('testToken 2')
    expect(jwt.verify.mock.calls[0][1]).toBe(process.env.SECRET)
    expect(badResult).toEqual({ verified: false })
  })
})
