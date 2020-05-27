const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if (!body.password || body.password.length < 5) {
      return response.status(400).send({ error: 'Make your password at least 5 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

usersRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const token = request.token
  const id = request.params.id

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const userToUpdate = await User.findById(id)

    if (!userToUpdate) {
      return response.status(400).json({ error: 'no user with this id' })
    }

    if (userToUpdate.id !== decodedToken.id) {
      return response.status(401).json({ error: 'unauthorized user' })
    }

    userToUpdate.username = body.username
    userToUpdate.name = body.name
    userToUpdate.showIntro = body.showIntro

    const updatedUser = await userToUpdate.save()

    response.json(updatedUser)

  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter