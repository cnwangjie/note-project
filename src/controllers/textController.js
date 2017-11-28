import Joi from 'joi'
import Text from '../models/text'
import User from '../models/user'

const textController = {}

textController.create = async ctx => {
  const input = ctx.input()
  const validate = Joi.validate(input, Joi.object().keys({
    username: Joi.string().required(),
    token: Joi.string().required(),
    name: Joi.string().required(),
    data: Joi.string(),
  }))
  if (validate.error)
    return ctx.throw(400, validate.error)

  if (!await User.findOne({username: input.username}))
    return ctx.throw(404, 'user not exists')

  if (!User.compareToken(input))
    return ctx.throw(401, 'unauthenticated')

  if (await Text.findOne({owner: input.username, name: input.name}))
    return ctx.throw(403, 'a same name note has exists')


  const newText = await Text.create({
    owner: input.username,
    name: input.name,
    data: input.data || '',
  })

  ctx.body = newText
}

textController.update = async ctx => {
  const input = ctx.input()
  const validate = Joi.validate(input, Joi.object().keys({
    username: Joi.string().required(),
    token: Joi.string().required(),
    name: Joi.string().required(),
    data: Joi.string().required(),
  }))
  if (validate.error)
    return ctx.throw(400, validate.error)

  if (!await User.findOne({username: input.username}))
    return ctx.throw(404, 'user not exists')

  if (!User.compareToken(input))
    return ctx.throw(401, 'unauthenticated')

  const text = await Text.findOne({owner: input.username, name: input.name})

  if (!text)
    return ctx.throw(403, 'the note not exists')

  text.data = input.data
  await text.save()

  ctx.body = text
}

textController.getAll = async ctx => {
  console.log(ctx.request.params)
  const input = ctx.input()
  const validate = Joi.validate(input, Joi.object().keys({
    username: Joi.string().required(),
    token: Joi.string().required(),
    offset: Joi.number().integer().min(0),
    limit: Joi.number().integer().max(100),
    from: Joi.number().integer().min(0),
    to: Joi.number().integer(),
  }))
  if (validate.error)
    return ctx.throw(400, validate.error)

  if (!await User.findOne({username: input.username}))
    return ctx.throw(404, 'user not exists')

  if (!User.compareToken(input))
    return ctx.throw(401, 'unauthenticated')

  const texts = await Text.find({
    owner: input.username,
    created_at: { $gte: input.from || 0, $lte: input.to || Date.now() },
  }, null, {
    skip: input.offset || 0,
    limit: input.limit || 100,
  })

  ctx.body = texts

}

textController.get = async ctx => {
  const input = ctx.input()
  const validate = Joi.validate(input, Joi.object().keys({
    username: Joi.string().required(),
    token: Joi.string().required(),
    name: Joi.string().required(),
  }))
  if (validate.error)
    return ctx.throw(400, validate.error)

  if (!await User.findOne({username: input.username}))
    return ctx.throw(404, 'user not exists')

  if (!User.compareToken(input))
    return ctx.throw(401, 'unauthenticated')

  const text = await Text.findOne({owner: input.username, name: input.name})

  if (!text)
    return ctx.throw(403, 'the note not exists')

  ctx.body = text
}

textController.delete = async ctx => {
  const input = ctx.input()
  const validate = Joi.validate(input, Joi.object().keys({
    username: Joi.string().required(),
    token: Joi.string().required(),
    name: Joi.string().required(),
  }))
  if (validate.error)
    return ctx.throw(400, validate.error)

  if (!await User.findOne({username: input.username}))
    return ctx.throw(404, 'user not exists')

  if (!User.compareToken(input))
    return ctx.throw(401, 'unauthenticated')

  const text = await Text.findOne({owner: input.username, name: input.name})

  if (!text)
    return ctx.throw(403, 'the note not exists')

  await text.remove()

  ctx.body = {
    status: 'success',
  }
}

export default textController
