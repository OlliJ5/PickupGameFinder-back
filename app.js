const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const usersRouter = require('./controllers/users')

const app = express()

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error while connecting to database:', error.message)
  })

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)

module.exports = app