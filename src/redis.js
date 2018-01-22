import redis from 'redis'
import nconf from 'nconf'

let redisClient

const getRedisClient = () => {
  if (!redisClient) {
    const options = nconf.get('redis') || getRedisClient.connectOptions
    redisClient = redis.createClient(options)
  }

  return redisClient
}

getRedisClient.connectOptions = undefined

export default getRedisClient