import Koa from 'koa'
import path from 'path'
import nconf from 'nconf'
import yaml from 'js-yaml'
import log4js from 'log4js'
import bluebird from 'bluebird'
import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'
import api from './routes/api'

nconf.argv({
  parseValues: true,
}).env({
  lowerCase: true,
  parseValues: true,
}).file({
  file: path.join(__dirname, '../config.yaml'),
  format: {
    parse: yaml.safeLoad,
    stringify: yaml.safeDump,
  }
}).use('memory')

log4js.configure({
  appenders: {
    console: {
      type: 'stdout',
    },
  },
  categories: {
    default: {
      appenders: ['console'],
      level: nconf('debug') ? 'DEBUG' : 'INFO',
    },
  },
})

process.on('unhandledRejection', reason => {
  log4js.getLogger().error(reason)
})

mongoose.Promise = bluebird
mongoose.connect(nconf.get('mongodb'), {
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
    log4js.getLogger().debug(err)
    const json = {
      status: 'error',
      type: ctx.message,
    }

    if (ctx.status !== 500) {
      json.error = err.message
      json.message = false || undefined
    }

    ctx.body = json

  })
})
app.use(api.routes())

if (process.env.NODE_ENV !== 'testing')
  app.listen(nconf.get('port'))

export default app
