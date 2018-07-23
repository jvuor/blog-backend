var whitelist = ['http://localhost:3000']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback('Not allowed by CORS')
    }
  }
}

module.exports = corsOptions