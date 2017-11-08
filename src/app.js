global.Promise = require('bluebird')

const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const config = require('./config.js')

const init = async () => {

  if (config.debug) {
    process.on('unhandledRejection', reason => {
      throw reason
    })
  }

  const port = config.port
  if (!fs.existsSync(config.log.dir)) fs.mkdirSync(config.log.dir)
  mongoose.Promise = Promise
  global.mongoose = mongoose
  global.db = await mongoose.createConnection(config.mongodb, {
    promiseLibrary: Promise,
    useMongoClient: true,
    keepAlive: true,
  })

  const app = new Koa()
  global.app = app
  if (config.debug) {
    app.use(require('koa-logger')())
  }

  app.use(require('koa-bodyparser')())

  const routesPath = path.join(__dirname, './routes')
  fs.readdirSync(routesPath).map(routeFile => {
    app.use(require(path.join(routesPath, routeFile)).routes())
  })

  if (config.debug) {
    await app.listen(port)
    console.log(`Server is listening ${port} without any exception`)
  }

}

module.exports = {init}
