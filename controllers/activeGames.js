const jwt = require('jsonwebtoken')
const activeGamesRouter = require('express').Router()
const ActiveGame = require('../models/activeGame')
const User = require('../models/user')

activeGamesRouter.get('/', async (request, response) => {
  const activeGames = await ActiveGame.find({})
  response.json(activeGames)
})

activeGamesRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const activeGame = new ActiveGame({
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

    const savedGame = await activeGame.save()
    response.json(savedGame)
  } catch (exception) {
    next(exception)
  }
})


//This can be used to add a player to the game. The added player is recognized with the token
activeGamesRouter.put('/:id', async (request, response, next) => {
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const activeGame = await ActiveGame.findById(request.params.id)

    //checks if the player is already a participant in the game
    if (activeGame.participants.includes(user._id)) {
      return response.status(400).json({ error: 'player is already in the game' })
    }
    activeGame.participants = activeGame.participants.concat(user._id)
    await activeGame.save()

    response.json(activeGame)

  } catch (exception) {
    next(exception)
  }
})

module.exports = activeGamesRouter