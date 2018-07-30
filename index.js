const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const corsOptions = require('./utils/cors')

const mongoUrl = config.mongoUrl
const port = config.port

mongoose
  .connect(mongoUrl)
  .then( () => { console.log('connected to database', mongoUrl)})
  .catch( err => {
    console.log(err)
  })
  
app.use(bodyParser.json())
app.use(middleware.logger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', cors(corsOptions), blogRouter)
app.use('/api/users', cors(corsOptions), usersRouter)
app.use('/api/login', cors(corsOptions), loginRouter)
app.use('/admin', express.static('admin'))
app.get('*', express.static('build'))
app.use('*', express.static('build'))

app.use(middleware.error)

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

server.on('close', () => [
  mongoose.connection.close()
])

module.exports = { app, server}