import app from "../..";
import express, { Request, Response, NextFunction } from 'express';
import logger from "../../utils/logger";
export const profile = (request: Request, response: Response) => {
    logger.info(`${request.url} ${request.method}`);
    const data = request.body.sub;
    response.status(200).send(JSON.stringify(data));
};