
import { NextFunction, Request, Response } from "express";
import { request } from "http";
import JWT from "jsonwebtoken";
import logger from "../logger";
import { get } from "../redis";
import { signInParamsT } from "./types";
const accessTokenExpiration = '5m';
const refreshTokenExpiration = (60 * 60 * 24 * 30).toString();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "accesstokensecret";
const refreshTokenSecret = process.env.ACCESS_TOKEN_SECRET || "refreshtokensecret";

export const getToken = (params: signInParamsT, isAccessToken: boolean) => {
    const Token = JWT.sign(
        params,
        isAccessToken ? accessTokenSecret : refreshTokenSecret,
        {
            expiresIn: isAccessToken ? accessTokenExpiration : refreshTokenExpiration
        });
    return Token;
}
export const authToken = async (request: any, response: Response, next: NextFunction) => {
    const accessToken = request.headers['access-token'] ?? request.cookies['access-token'] ?? "";
    const refreshToken = request.headers['refresh-token'] ?? request.cookies["refresh-token"] ?? "";
    const checkToken = await get(refreshToken);
    if (checkToken == null) {
        response.sendStatus(401);
        return;
    }
    if (accessToken === "") {
        JWT.verify(refreshToken, refreshTokenSecret, (err: any, data: any) => {
            if (err) {
                logger.error(`JWT ERROR ${err}`)
                response.sendStatus(401)
                return;
            };
            request.body.sub = data;
            const accessToken = getToken({ UUID: data.UUID, userName: data.userName }, true);
            response.header("access-token", accessToken);
            response.cookie("access-token", accessToken);
            next();
            return;
        })
    }
    JWT.verify(accessToken, accessTokenSecret, (err: any, data: any) => {
        if (err) {
            logger.error(`JWT ERROR ${err}`)
            JWT.verify(refreshToken, refreshTokenSecret, (err: any, data: any) => {
                if (err) {
                    logger.error(`JWT ERROR ${err}`)
                    response.sendStatus(401)
                    return;
                };
                request.body.sub = data;
                const accessToken = getToken({ UUID: data.UUID, userName: data.userName }, true);
                response.header("access-token", accessToken);
                response.cookie("access-token", accessToken);
                next();
                return;
            })
        };
        request.body.sub = data;
        next();
    })
}