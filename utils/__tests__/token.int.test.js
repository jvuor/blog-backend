const token = require('../token')

describe('token, integration test with jsonwebtoken', () => {
  test('signToken returns signed data', () => {
    const data = { username: 'testtest', id: 'testtesttest' }
    const result = token.signToken(data)

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThanOrEqual(155)
    expect(result.slice(0, 2)).toBe('ey')
  })

  test('verifyToken decodes signed data', () => {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R0ZXN0IiwiaWQiOiJ0ZXN0dGVzdHRlc3QiLCJpYXQiOjE1MzY4NDc0MjZ9._QTr0bEo7RzSkfye8uNM3DylWbg0735NM1IUM5nMWVw'
    const result = token.verifyToken(testToken)
    expect(Object.keys(result).length).toBe(3)
    expect(result.verified).toBe(true)
    expect(result.username).toBe('testtest')
    expect(result.id).toBe('testtesttest')

    // bad path
    const badToken = testToken.slice(150)
    const badResult = token.verifyToken(badToken)
    expect(Object.keys(badResult).length).toBe(1)
    expect(badResult.verified).toBe(false)
  })

  test('verifyToken decodes data signed by signToken', () => {
    const testData = {
      username: 'fdsfhokkh',
      id: 13154346245
    }
    const signedData = token.signToken(testData)

    expect(typeof signedData).toBe('string')
    expect(signedData.length).toBeGreaterThanOrEqual(155)
    expect(signedData.slice(0, 2)).toBe('ey')

    const verifiedData = token.verifyToken(signedData)

    expect(Object.keys(verifiedData).length).toBe(3)
    expect(verifiedData.verified).toBe(true)
    expect(verifiedData.username).toBe(testData.username)
    expect(verifiedData.id).toBe(testData.id.toString())
  })
})
