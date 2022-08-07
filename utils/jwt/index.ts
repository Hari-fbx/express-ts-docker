
import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { signInParamsT } from "./types";
const jwt_expiration = 60 * 10;
const jwt_refresh_expiration = 60 * 60 * 24 * 30;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "secret"
export const getToken =  (params:signInParamsT)=>{
    const accessToken = JWT.sign(params, accessTokenSecret,{expiresIn:'10s'});
    return accessToken;
}

export const authenticatetoken = (request:any,response:Response,next:NextFunction)=>{
    const accessToken = request.headers['access-token']?.toString() ?? "";
    if(accessToken === "") response.sendStatus(401);
    JWT.verify(accessToken,accessTokenSecret,(err: any,data: any)=>{
        if(err) response.sendStatus(401);
        request.body.sub = data;
        next();
    })
}