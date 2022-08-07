import express from 'express';

import bodyParser from 'body-parser';
import signin from './api/signin';
import { authToken } from './utils/jwt';
import { profile } from './api/profile';
import logger from './utils/logger';
import { sqlInit } from './utils/mysql';
import { signup } from './api/signup';
import { signout } from './api/signout';


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.listen(port,() => {
  logger.info(`application started at http://localhost:${port}`);
});

sqlInit();

app.post("/signin", signin);
app.post("/profile",authToken, profile);
app.post("/signup",signup);
app.get("/signout",signout);




export default app;


