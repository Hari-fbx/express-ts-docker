import { Request, Response } from "express";
import { user } from "../../schema/user";
import { getToken } from "../../utils/jwt";
import logger from "../../utils/logger";
import { query } from "../../utils/mysql";
import {v4 as uuidv4} from "uuid";
import { OkPacket } from "mysql";
import { set } from "../../utils/redis";

export const signup= async (request:Request, response:Response) => {
    logger.info(`${request.url} ${request.method}`);
    const {userName, password, confirmPassword}= request.body??{};
    if(!(userName && password))  response.sendStatus(400);
    const res = await query<user[]>(`select * from users where username='${userName}'`, []);
    if(res.length>0){
        response.status(200).send({
            message:"username already taken"
        })
        return;
    }
    if(password !== confirmPassword)  {
        response.sendStatus(406);
        return;
    }
    const UUID = uuidv4().toString();
    logger.info(`user created ${UUID}  ${userName}`)
    const resp = await query<OkPacket>(`insert into users values('${UUID}','${userName}','${password}')`,[]);
    const user ={
        UUID,
        userName
    }
    const accessToken = getToken(user,true);
    const refreshToken = getToken(user,false);
    response.cookie("access-token",accessToken);
    response.cookie("refresh-token",accessToken);
    response.status(200).send({
        "accessToken":accessToken,
        "refreshToken":refreshToken
    })
    set(refreshToken,user);
    console.log(resp.affectedRows);
};