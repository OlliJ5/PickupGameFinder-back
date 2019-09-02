const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


app.use(bodyParser.json())
app.use(morgan('tiny'))

module.exports = app