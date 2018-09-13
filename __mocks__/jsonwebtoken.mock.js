const jsonwebtoken = {
  verify: jest.fn(() => Promise.resolve()),
  sign: jest.fn(() => Promise.resolve())
}

module.exports = jsonwebtoken
