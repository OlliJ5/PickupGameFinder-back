const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
  startTime: Date,
  endTime: Date,
  durationMins: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  location: {
    lat: Number,
    long: Number
  },
  desc: String,
  maxParticipants: Number
})

gameSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game