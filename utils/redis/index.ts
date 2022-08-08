
import  * as redis from "redis";
import { user } from "../../schema/user";
import logger from "../logger";

const redisClient = redis.createClient();

(async () => {
  await redisClient.connect();
})();

redisClient.on('connect', () =>logger.info("Redis connected"));
redisClient.on('error', (err) => logger.error(` Redis Connection Error ${err}`))

export const get =async (token:string)=>{
  try{
    return new Promise(async (resolve,reject)=>{
      redisClient.get(token).then(res=>{
      resolve(res);
      }).catch(err=>{
      logger.error(`redis get ${err}`);
      reject(err)
    })
    })
  }catch(err){
    logger.error(err);
  }
  
}
export const set =async (token:string,user:user)=>{
  try{
    return new Promise(async (resolve,reject)=>{
      redisClient.set(token,JSON.stringify(user)).then(res=>{
      resolve(res);
      }).catch(err=>{
      logger.error(`redis get ${err}`);
      reject(err)
    })
    })
  }catch(err){
    logger.error(err);
  }
  
}
export const del =async (token:string)=>{
  try{
    return new Promise(async (resolve,reject)=>{
      redisClient.DEL(token).then(res=>{
      resolve(res);
      }).catch(err=>{
      logger.error(`redis get ${err}`);
      reject(err)
    })
    })
  }catch(err){
    logger.error(err);
  }
  
}
export default redisClient;