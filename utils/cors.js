var whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003', 'https://jvuor-blog.herokuapp.com', 'http://localhost:4200', 'https://www.jussi.app']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      console.log(origin)
      callback(new Error('Not allowed by CORS:' + origin))
    }
  }
}

module.exports = corsOptions
