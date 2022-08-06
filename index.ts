import express from 'express';
import * as redis from "redis";
import bodyParser from 'body-parser';
import signin from './api/signin';
import { authenticatetoken } from './utils/jwt';
import { profile } from './api/profile';

const app = express();
const redisClient = redis.createClient();
(async () => {
  await redisClient.connect();
})();

redisClient.on('connect', () => console.log('Redis redisClient Connected'));
redisClient.on('error', (err) => console.log('Redis redisClient Connection Error', err))


const port =process.env.PORT || 3000;


app.use(bodyParser.json());
app.listen(port, async () => {
  console.log(`http://localhost:${port}.`);
});


app.post("/signin",signin);
app.post("/profile",authenticatetoken,profile);
export default app;


  
  