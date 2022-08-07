import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { user } from "../../schema/user";
import { getToken } from "../../utils/jwt";
import logger from "../../utils/logger";
import { query } from "../../utils/mysql";
import {v4 as uuidv4} from "uuid";
import { OkPacket } from "mysql";

export const signup= async (request: Request, response:Response) => {
    const {userName, password, confirmPassword}= request.body??{};
    if(!(userName && password))  response.sendStatus(400);
    const res = await query<user[]>(`select * from users where username='${userName}'`, []);
    if(res.length>0){
        response.status(200).send({
            message:"username already taken"
        })
    }
    if(password !== confirmPassword)  response.sendStatus(406);
    const UUID = uuidv4().toString();
    logger.info(`user created ${UUID}  ${userName}`)
    const resp = await query<OkPacket>(`insert into users values('${UUID}','${userName}','${password}')`,[]);
    const token = getToken({
        UUID,
        userName
    });
    response.cookie("access-token",token);
    response.status(200).send({
        "accessToken":token
    })
    console.log(resp.affectedRows);
};