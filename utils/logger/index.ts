
import { createLogger, transports, format } from 'winston';
const getDate = (date:Date)=>{
  return `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
}
const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.File({
      filename: `./logs/${getDate(new Date)}.log`,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.Console(),
  ]
});

export default logger;