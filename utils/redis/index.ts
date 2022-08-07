import  * as redis from "redis";
import logger from "../logger";

const redisClient = redis.createClient();

(async () => {
  await redisClient.connect();
})();

redisClient.on('connect', () =>logger.info("Redis connected"));
redisClient.on('error', (err) => logger.error(` Redis Connection Error$ {err}`))

export default redisClient;