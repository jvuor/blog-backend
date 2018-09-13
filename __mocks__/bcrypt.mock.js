const hash = () => jest.fn(() => Promise.resolve())
const compare = () => jest.fn(() => Promise.resolve())

module.exports = { hash, compare }
