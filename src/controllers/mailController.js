import Joi from 'joi'
import sendmail from '../utils/sendmail'
import User from '../models/user'
import Mail from '../models/mail'

const mailController = {}

mailController.getEmail = async ctx => {
  const input = ctx.input()
  const validate = Joi.validate(input, Joi.object().keys({
    email: Joi.string().email().required(),
    use: Joi.string().max(20).required(),
  }))
  if (validate.error) return ctx.throw(400, validate.error)

  if (!await User.findOne({ email: input.email }))
    return ctx.throw(403, 'email address not be registered here')

  const mails = await Mail.find({
    email: input.email,
    use: input.use
  }, 'created_at', {
    created_at: {
      $sort: -1,
    },
  })
  if (mails.length > 0 &&
    Date.now() - mails.shift().created_at < 5E3)
    return ctx.throw(403, 'too frequently')

  const mail = await Email.create({
    email: input.email,
    use: input.use,
    hash: Math.random().toString(36).substr(2),
    created_at: Date.now(),
    expired_time: 3600E3,
  })

  sendmail({
    to: input.email,
    subject: `${input.use}`,
    text: ``
  })
}
