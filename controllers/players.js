const jwt = require('jsonwebtoken')
const playersRouter = require('express').Router()
const Player = require('../models/player')
const Game = require('../models/game')
const User = require('../models/user')

playersRouter.get('/', async (request, response) => {
  const players = await Player.find({})
  response.json(players)
})

playersRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const game = await Game.findById(body.game)

    const playerObject = new Player({
      user: user._id,
      game: game._id
    })

    if (game.participants.includes(user._id)) {
      return response.status(400).json({ error: 'player is already in the game' })
    }

    const savedPlayer = await playerObject.save()
    game.participants = game.participants.concat(user._id)
    await game.save()

    response.status(201).json(savedPlayer)

  } catch (exception) {
    next(exception)
  }
})

module.exports = playersRouter