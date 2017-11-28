import crypto from 'crypto'
import Joi from 'joi'
import User from '../models/user'
import bcrypt from '../utils/bcrypt'

const userController = {}

userController.register = async ctx => {
  const input = ctx.input()
  const validate = Joi.validate(input, Joi.object().keys({
    email: Joi.string().email().required(),
    username: Joi.string().max(20).required(),
    nickname: Joi.string().max(20).required(),
    password: Joi.string().min(6).required(),
  }))
  if (validate.error) return ctx.throw(400, validate.error)

  if (await User.findOne({ email: input.email }))
    return ctx.throw(403, 'email has been used')

  if (await User.findOne({ username: input.username }))
    return ctx.throw(403, 'username has been used')

  const newUserData = {
    username: input.username,
    email: input.email,
    nickname: input.nickname,
    password_hash: await bcrypt.hash(input.password),
  }

  const newUser = await User.create(newUserData)

  ctx.body = newUser
}

userController.getToken = async ctx => {
  const input = ctx.input()
  const validate = Joi.validate(input, Joi.object().keys({
    username: Joi.string().max(20).required(),
    password: Joi.string().required(),
  }))
  if (validate.error) return ctx.throw(400, validate.error)

  const user = await User.findOne({ username: input.username })
  if (!user) return ctx.throw(404, 'user not exists')

  if (!bcrypt.compare(input.password, user.password_hash))
    return ctx.throw(403, 'password wrong')

  user.token = crypto.createHash('sha256')
    .update(Object.values(user.toJSON()).join('') + Date.now())
    .digest('hex')

  await user.save()

  ctx.body = {
    status: 'success',
    token: user.token,
  }
}

userController.index = async ctx => {
  const input = ctx.input()
  const validate = Joi.validate(input, Joi.object().keys({
    username: Joi.string().max(20).required(),
  }))
  if (validate.error) return ctx.throw(400, validate.error)

  const user = await User.findOne({ username: input.username })
  if (user) ctx.body = user
  else ctx.throw(404, 'user not exists')
}

export default userController
