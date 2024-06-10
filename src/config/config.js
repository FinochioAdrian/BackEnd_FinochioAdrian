import dotenv from "dotenv";

const environment = process.env.NODE_ENV || "production";
dotenv.config({
  path: `./.env.${environment}`,
});
const PORT = process.env.PORT_ASSIGNED || process.env.PORT;

export default {
  ENTORNO: process.env.NODE_ENV,
  PRIVATE_KEY_COOKIE: process.env.PRIVATE_KEY_COOKIE,
  PORT,
  MONGO_URL: process.env.MONGO_URL,
  PRIVATE_KEY_JWT: process.env.PRIVATE_KEY_JWT,
  CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
  CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
  CALLBACK_URL_GITHUB: `${process.env.HOST}:${process.env.PORT}${process.env.ENDPOINT_URL_GITHUB}`,
  PERSISTENCE: process.env.PERSISTENCE,
  HOST: process.env.HOST,
  PASSNODEMAILER:process.env.PASSNODEMAILER,
  USERMAIL:process.env.USERMAIL
};
