const path = require('path')

module.exports = {
  port: process.env.PORT || 2003,
  mongodb: 'mongodb://127.0.0.1:27017/ntdb',
  debug: true,
  log: {
    dir: path.join(__dirname, '../log'),
  }
}
