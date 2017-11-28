import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    index: true,
  },
  nickname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    index: true,
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  password_hash: String,
  token: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    transform: doc => {
      return {
        username: doc.username,
        email: doc.email,
        email_verified: doc.email_verified,
        nickname: doc.nickname,
      }
    }
  }
})

userSchema.statics.compareToken = async function({username, token}) {
  return !!this.findOne({username, token})
}

const User = mongoose.model('User', userSchema)

module.exports = User
