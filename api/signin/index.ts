import express, { Request, Response, NextFunction, response } from 'express';
import logger from "../../utils/logger/"
import { getToken } from '../../utils/jwt';
const signin =  (request: Request, response: Response) => {
  logger.info(`${request.url} ${request.method}`);
  const {userName,password} = request.body?? null;
  if(!(userName && password)){
    response.status(200).send({
      "status":23,
      "message":"username or password is incorrect"
    })
    return;
  }
  const accessToken = getToken({
    userName,
    signDate: new Date().toUTCString(),
  });

  logger.info( `token : ${userName}`);
  
  response.cookie("access-token",accessToken,{

  })
  response.status(200).send({
    accessToken
  })
  };
  
  export default signin;