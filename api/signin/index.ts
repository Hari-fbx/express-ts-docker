import express, { Request, Response, NextFunction, response } from 'express';
import logger from "../../utils/logger/"
import { getToken } from '../../utils/jwt';
import { query } from '../../utils/mysql';
import { user } from '../../schema/user';
import { set } from '../../utils/redis';
const signin = async (request: Request, response: Response) => {
  logger.info(`${request.url} ${request.method}`);
  const { userName, password } = request.body ?? null;
  if (!(userName && password)) {
    response.status(404).send({
      "message": "username or password is empty"
    })
    return;
  }
  const res = await query<user[]>(`select * from users where username='${userName}'`, []);
  if (res.length == 0) {
    response.status(404).send({
      message: "user not found"
    });
    return;
  }
  if(password!=res[0].password) {
    response.sendStatus(401);
    return;
  }
  
  const user = {
    UUID:res[0].UUID,
    userName:userName
  }
  const accessToken = getToken(user,true);
  const refreshToken = getToken(user,false);
  set(refreshToken,user);
  // logger.info(`token : ${userName}`);
  response.setHeader("access-token",accessToken);
  response.setHeader("refresh-token",refreshToken);
  response.cookie("access-token", accessToken, {
  });
  response.cookie("refresh-token", refreshToken, {
  });
  response.status(200).send({
    accessToken,
    refreshToken
  })
};

export default signin;