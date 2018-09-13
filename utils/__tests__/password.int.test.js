const password = require('../password')

const expectedSaltRounds = 10

const randomPassword = (length) => {
  let randomPassword = ''
  const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö0123456789'

  // Math.random() is NOT cryptographically random but we are only using it to generate test cases here
  for (let i = 0; i < length; i++) { randomPassword += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length)) }

  return randomPassword
}

describe('password test, integration test with bcrypt', () => {
  test('hashPassword returns hashed password', async () => {
    const testPassword = 'password'
    const result = await password.hashPassword(testPassword)
    // from bcrypt documentation: hash is always 60 characters long
    expect(result.length).toBe(60)
    expect(result.slice(0, 6)).toBe(`$2b$${expectedSaltRounds}`)
  })

  test('checkPassword correctly compares hashes and plain text passwords', async () => {
    const testPassword = 'password'
    const testHash = '$2b$10$UBMvXElbsX5g72lJY8.L8OfijKcG48MSu3hoiZNCzCikS5CYuY2QC'

    const result = await password.checkPassword(testPassword, testHash)
    expect(result).toBe(true)
    const badResult1 = await password.checkPassword('pssword', testHash)
    const badResult2 = await password.checkPassword(testHash, testPassword)
    const badResult3 = await password.checkPassword(testPassword, testHash.slice(59))
    expect(badResult1).toBe(false)
    expect(badResult2).toBe(false)
    expect(badResult3).toBe(false)
  })

  test('checkPassword works with hash returned from hashPassword', async () => {
    for (let i = 0; i < 10; i++) {
      // doing ten checks with variable length passwords
      const testPassword = randomPassword(8 + i)
      const passwordHash = await password.hashPassword(testPassword)
      const result = await password.checkPassword(testPassword, passwordHash)
      expect(result).toBe(true)
      const badResult = await password.checkPassword(randomPassword(i), passwordHash)
      expect(badResult).toBe(false)
    }
  })
})
