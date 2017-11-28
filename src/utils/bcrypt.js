import bcrypt from 'bcrypt'

export default {
  hash: password =>
    new Promise((resolve, reject) =>
      bcrypt.hash(password, 10, (err, hash) =>
        err ? reject(err) : resolve(hash))),

  compare: (password, hash) =>
      new Promise((resolve, reject) =>
        bcrypt.compare(password, hash, (err, res) =>
          err ? reject(err) : resolve(res))),
}
