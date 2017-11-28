import chai from 'chai'
import rp from 'request-promise'
import app from '../src/app'
import User from '../src/models/user'
import bcrypt from '../src/utils/bcrypt'

const server = app.listen(0)
const address = server.address()
const request = rp.defaults({
  baseUrl: 'http://127.0.0.1:' + address.port,
  resolveWithFullResponse: true,
  transform: (body, res) => {
    try {
      res.data = JSON.parse(res.body)
      res.isJSON = true
    } catch (e) {
      res.isJSON = false
    }
    return res
  }
})

const expect = chai.expect
before(async () => {
  await User.create({
    username: 'test',
    email: 'test@a.aa',
    nickname: 'test',
    password_hash: await bcrypt.hash('123456'),
  })
})
after(async () => {
  await User.remove({ username: 'test' })
})
describe('api', () => {
  it('server should running without error', async () => {
    const res = await request('/')
    expect(res.statusCode).to.equal(200)
    expect(res.data.status).to.equal('success')
  })
  describe('GET /user/:username', async () => {
    it('should return an object', async () => {
      const res = await request('/user/test')
      expect(res.data).to.be.a('object')
    })
    it('should be transform', async () => {
      const res = await request('/user/test')
      expect(res.data).to.not.have.property('password_hash')
    })
  })
})
