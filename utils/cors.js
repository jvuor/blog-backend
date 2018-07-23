var whitelist = ['http://localhost:3000']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      console.log(origin)
      callback('Not allowed by CORS')
    }
  }
}

module.exports = corsOptions