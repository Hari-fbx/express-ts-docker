import express from 'express';

import bodyParser from 'body-parser';
import signin from './api/signin';
import { authToken } from './utils/jwt';
import { profile } from './api/profile';
import logger from './utils/logger';
import { sqlInit } from './utils/mysql';
import { signup } from './api/signup';
import { signout } from './api/signout';
import cookieParser from "cookie-parser";


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

app.listen(port,() => {
  logger.info(`application started at http://localhost:${port}`);
});

sqlInit();

app.post("/signin", signin);
app.get("/profile",authToken, profile);
app.post("/signup",signup);
app.get("/signout",signout);




export default app;


