if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
  
let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URL

if (process.env.NODE_ENV === 'test') {
  port = process.env.PORT_TEST
  mongoUrl = process.env.MONGODB_TEST_URL
}

module.exports = {
  mongoUrl,
  port
}