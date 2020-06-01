const jwt = require('jsonwebtoken')
const gamesRouter = require('express').Router()
const Game = require('../models/game')
const User = require('../models/user')
const Player = require('../models/player')

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

    //calculate the ending time of the game
    const startTime = Date.now()
    const durationMs = body.durationMins * 60 * 1000
    const endTime = startTime + durationMs

    const game = new Game({
      startTime: startTime,
      endTime: endTime,
      durationMins: body.durationMins,
      owner: user._id,
      participants: [user._id],
      location: {
        lat: body.location.lat,
        long: body.location.lng
      },
      desc: body.desc,
      maxParticipants: body.maxParticipants
    })


    const savedGame = await game.save()

    const player = new Player({
      user: user._id,
      game: savedGame._id
    })

    await player.save()

    const populatedGame = await Game.findById(savedGame._id)
      .populate('owner', 'username')
      .populate('participants', 'username')
    response.status(201).json(populatedGame)
  } catch (exception) {
    next(exception)
  }
})

gamesRouter.get('/active', async (request, response) => {
  const activeGames = await Game.find({
    endTime: {
      $gte: Date.now()
    }
  }).populate('owner', 'username')
    .populate('participants', 'username')

  response.json(activeGames)
})

gamesRouter.get('/owner/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const games = await Game.find({
      owner: id
    }).populate('owner', 'username')
      .populate('participants', 'username')
    console.log('pelit', games)
    response.json(games)
  } catch (exception) {
    next(exception)
  }

})

module.exports = gamesRouter