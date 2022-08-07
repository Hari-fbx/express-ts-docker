import express from 'express';

import bodyParser from 'body-parser';
import signin from './api/signin';
import { authenticatetoken } from './utils/jwt';
import { profile } from './api/profile';
import logger from './utils/logger';
import { sqlInit } from './utils/mysql';


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.listen(port,() => {
  logger.info(`application started at http://localhost:${port}`);
});

sqlInit();

app.post("/signin", signin);
app.post("/profile", authenticatetoken, profile);




export default app;



