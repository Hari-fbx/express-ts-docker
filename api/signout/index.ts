import { Request, Response } from "express";
import app from "../..";
import logger from "../../utils/logger";
import { del } from "../../utils/redis";

export const signout = async (request: Request, response: Response) => {
    logger.info(`${request.url} ${request.method}`);
    const refreshToken = request.headers['refresh-token'] ?? request.cookies["refresh-token"] ?? "";
    const resp = await del(refreshToken);
    response.sendStatus(200);
    
};