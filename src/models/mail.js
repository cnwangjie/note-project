import redis from './../redis'

const Mail = {}

Mail.create = async ({email, use, hash, create_at, expired_time}) => {
  await redis().setAsync(`${email}-${use}-${hash}`, create_at, 'PX', expired_time)
  return {email, use, hash, create_at, expired_time}
}

Mail.findOne = async ({email, use, hash}) => {
  return redis().getAsync(`${email}-${use}-${hash}`)
}

export default Mail
