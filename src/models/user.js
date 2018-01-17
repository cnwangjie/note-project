import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    index: true,
  },
  nickname: String,
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
  token: Schema.Types.Mixed,
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

userSchema.statics = {
  async compareToken({username, token, act}) {
    const user = this.findOne({username})
    if (!user) throw new Error('USER_NOT_EXISTS')
    if (!(token in user.token)) throw new Error('TOKEN_NOT_EXISTS')
    const t = user.token[token]
    if (Date.now() > t.created_at + t.life) {
      delete user.token[token]
      await user.save()
      throw new Error('TOKEN_EXPIRE')
    }

    if (t.act.indexOf(act) === -1) throw new Error('FORBIDDEN')

    return true
  }
}

const User = mongoose.model('User', userSchema)

export default User
