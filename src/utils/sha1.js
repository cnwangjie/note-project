import crypto from 'crypto'

const sha1 = str => crypto.createHash('sha1').update(str).digest('hex')

export default sha1