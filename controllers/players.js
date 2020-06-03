const jwt = require('jsonwebtoken')
const playersRouter = require('express').Router()
const Player = require('../models/player')
const Game = require('../models/game')
const User = require('../models/user')

playersRouter.get('/', async (request, response) => {
  const players = await Player.find({}).populate('user', 'username')
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

    if (!game) {
      console.log('paskan möivät')
      response.status(400).send({ error: 'Game with this index does not exist' })
    }

    const playerObject = new Player({
      user: user._id,
      game: game._id
    })

    if (game.participants.includes(user._id)) {
      return response.status(400).json({ error: 'player is already in the game' })
    }

    await playerObject.save()
    game.participants = game.participants.concat(user._id)
    await game.save()

    response.status(201).json({ user, game: game._id })

  } catch (exception) {
    next(exception)
  }
})

playersRouter.get('/user/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const userGames = await Player.find({
      user: id
    }).populate('game')
    console.log('pelit', userGames)
    response.json(userGames)
  } catch (exception) {
    next(exception)
  }
})

module.exports = playersRouter