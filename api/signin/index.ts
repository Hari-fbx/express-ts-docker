import express, { Request, Response, NextFunction, response } from 'express';
import logger from "../../utils/logger/"
import { getToken } from '../../utils/jwt';
import { query } from '../../utils/mysql';
import { user } from '../../schema/user';
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
  }
  if(!(userName==res[0].username && password===res[0].password)) response.sendStatus(401);
  const accessToken = getToken({
    UUID:res[0].UUID,
    userName,
  });

  logger.info(`token : ${userName}`);
  response.setHeader("access-token",accessToken);
  response.cookie("access-token", accessToken, {

  })
  response.status(200).send({
    accessToken
  })
};

export default signin;