const mongoose = require('mongoose')

const activeGameSchema = mongoose.Schema({
  startTime: {
    type: Date,
    default: Date.now
  },
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

activeGameSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const ActiveGame = mongoose.model('ActiveGame', activeGameSchema)

module.exports = ActiveGame