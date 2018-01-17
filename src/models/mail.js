import mongoose from 'mongoose'

const Schema = mongoose.Schema

const mailSchema = new Schema({
  email: String,
  use: String,
  hash: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  expired_time: Number,
}, {
  timestamps: {
    createdAt: 'created_at',
  },
  toJSON: {
    transform: doc => {
      return {}
    }
  }
})

const Mail = mongoose.model('Mail', textSchema)

export default Mail
