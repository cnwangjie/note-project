import bluebird from 'bluebird'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import api from './routes/api'
import mongoose from 'mongoose'

process.on('unhandledRejection', reason => {
  throw reason
})

mongoose.Promise = bluebird
mongoose.connect('mongodb://127.0.0.1:27017/ntdb', {
  promiseLibrary: Promise,
  useMongoClient: true,
  keepAlive: true,
})

const app = new Koa

app.use(bodyParser())
app.use(async (ctx, next) => {
  ctx.input = () => {
    const request = ctx.request
    return Object.assign({}, ...[
      request.body,
      request.query,
      request.params,
      ctx.params,
    ])
  }
  return next()
})
app.use(async (ctx, next) => {
  return next().catch(err => {
    ctx.status = err.status || 500
    const json = {
      status: 'error',
      type: ctx.message,
    }

    if (ctx.status !== 500) {
      json.error = err.message
      json.message = false || undefined
    } else {
      const req = ctx.request
      // log(req, {
      //   params: req.params,
      //   query: req.query,
      //   body: req.body,
      // }, err)
    }

    ctx.body = json

    console.log(err)
  })
})
app.use(api.routes())

if (process.env.NODE_ENV !== 'testing')
  app.listen(2003)

export default app
