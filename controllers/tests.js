const router = require('express').Router()
const Game = require('../models/game')
const User = require('../models/user')
const Player = require('../models/player')

router.post('/reset', async (request, response) => {
  await Game.deleteMany({})
  await User.deleteMany({})
  await Player.deleteMany({})

  response.status(204).end()
})

module.exports = router