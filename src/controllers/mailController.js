import Joi from 'joi'
import User from '../models/user'
import Mail from '../models/mail'
import url from '../utils/url'
import sendmail from '../utils/sendmail'
import renderFile from '../utils/renderFile'

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

  await sendmail({
    to: input.email,
    subject: `${input.use}`,
    html: await renderFile('verifyMail', {
      title: subject,
      use: input.use,
      link: url('/mail/verify', {
        email: input.email,
        use: input.use,
        hash: mail.hash,
      })
    })
  })

  ctx.body = {
    status: 'success',
    email: input.email,
    use: input.use,
    time: mail.created_at,
  }
}

mailController.verifyEmail = async ctx => {
  const input = ctx.input()
  const validate = Joi.validate(input, Joi.object().keys({
    email: Joi.string().email().required(),
    use: Joi.string().max(20).required(),
    hash: Joi.string().required(),
  }))
  if (validate.error) return ctx.throw(400, validate.error)

  const email = await Email.findOne({
    email: input.email,
    use: input.use,
    hash: email.hash,
  })

  if (!email) return ctx.body = await ctx.renderFile('info', {
    title: 'verify failed',
    message: 'link invalid',
  })

  await email.remove()
  const user = await User.findOne({ email: input.email })
  user.email_verified = true
  await user.save()
  return ctx.body = await ctx.renderFile('info', {
    title: 'verify success',
    message: 'verify success',
  })
}

export default mailController