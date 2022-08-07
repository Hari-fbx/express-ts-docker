import connection, { Query } from "mysql2";
import logger from "../logger";
const sqlClient = connection.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'test',
    database: "dockertest"
});
export const sqlInit = async () => {
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
export default sqlClient;