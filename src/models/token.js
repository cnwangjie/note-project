import mongoose from 'mongoose'
import sha1 from './../utils/sha1'

const Schema = mongoose.Schema

const tokenSchema = new Schema({
  hash: {
    type: String,
    unique: true,
  },
  user: {
    type: String,
    index: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  access: [String]
}, {
  timestamps: {
    created_at: 'created_at',
  },
})

tokenSchema.static = {
  async genToken({user, access}) {
    const hash = sha1(user + access + Date.now())
    return this.create({username, hash, access})
  },
  async compareToken({user, hash, act}) {
    const token = await this.findOne({user, hash})
    return token && token.access.indexOf(act) !== -1
  }
}

const Token = mongoose.model('Token', tokenSchema)

export default Token