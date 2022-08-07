import connection, { Query } from "mysql";
import { resolve } from "path";
import { rejections } from "winston";
import logger from "../logger";
const sqlClient = connection.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'test',
    database: "dockertest"
});
export const sqlInit =  () => {
    sqlClient.connect((err) => {
        if (err) logger.error(err);
        else {
            logger.info(`SQL CONNTECTION DONE`);
        }
    });
    const createUserTable = sqlClient.query("CREATE TABLE if not exists users (UUID VARCHAR(100) NOT NULL,username VARCHAR(255), password VARCHAR(255), PRIMARY KEY(UUID))", (err, result) => {
        if (err) {
            return null;
        } else {

            return result;
        }
    })
    console.log(createUserTable);
}
export const query = <T>(query: string, params: string[] | Object): Promise<T> => {
    try {
      if (!sqlClient) {
        logger.error('Pool was not created. Ensure pool is created when running the app.');
    }
      return new Promise<T>((resolve, reject) => {
        sqlClient.query(query, params, (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
  
    } catch (error) {
     logger.error(`[mysql.connector][execute][Error]: ${error}`);
      return new Promise<T>((resolve,reject)=>{
        reject(error);
      })
    }
  }
export default sqlClient;