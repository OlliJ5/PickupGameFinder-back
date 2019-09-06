const jwt = require('jsonwebtoken')
const gamesRouter = require('express').Router()
const Game = require('../models/game')
const User = require('../models/user')

gamesRouter.get('/', async (request, response) => {
  const games = await Game.find({})
  response.json(games)
})

gamesRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const game = new Game({
      durationMins: body.durationMins,
      owner: user._id,
      participants: [user._id],
      location: {
        lat: body.location.lat,
        long: body.location.long
      },
      desc: body.desc,
      maxParticipants: body.maxParticipants
    })

    const savedGame = await game.save()
    response.status(201).json(savedGame)
  } catch (exception) {
    next(exception)
  }
})

module.exports = gamesRouter