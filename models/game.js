const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
  startTime: Date,
  endTime: Date,
  durationMins: {
    type: Number,
    required: true,
    min: 1,
    max: 180
  },
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
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    long: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  desc: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 140
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  }
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