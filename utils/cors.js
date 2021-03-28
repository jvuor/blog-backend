const whitelist = (process.env.NODE_ENV !== 'production')
  ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003']
  : ['https://www.jussi.app']

const corsOptions = {
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
