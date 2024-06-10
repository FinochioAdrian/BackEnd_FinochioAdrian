import jwt from "jsonwebtoken";

import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import authorization from "./utils/auth.middleware.js";
import passportCall from "./utils/passportCall.js";
import errorHandler from './utils/errors/index.js'
import { logger } from "./utils/loggerMiddleware/logger.js";
import envConfig from './config/config.js'
import {transportGmailNodemailer as transportGmail } from './utils/sendEmail.js'

/* Una private key sirve para utilizarse al momento de hacer el cifrado del token */
const PRIVATE_KEY_JWT =envConfig.PRIVATE_KEY_JWT ;


const auth = authorization
export {passportCall,auth,errorHandler}



/** generateToken: al utilizar el jwt.sing
 * El primer argumento es un objeto con la información
 * El segundo argumento es la llave privada con la cual se realizará el cifrado
 * El tercer argumento es un objeto con el tiempo de expiración del token
 *  */

export const generateToken = (user,expiresIn="1h") => {
  
  
  const token = jwt.sign({ user }, PRIVATE_KEY_JWT, { expiresIn });
  return token;
};
export const authToken = (req, res, next) => {

  const authHeader = req.headers.authorization || req.query.token;

  if (!authHeader) {
    if (req.accepts("html")) return res.redirect("/login?error=Not_authorized");
    return res.status(403).send({ error: "Not authorized" });
  }
  let token = authHeader;
  

  if (authHeader.includes("Bearer")) {
    token = authHeader.split(" ")[1];
    
  }

  jwt.verify(token, PRIVATE_KEY_JWT, (err, credentials) => {
    if (err) {
      if (req.accepts("html")) return res.redirect("/login?error=Not_authorized");
      return res.status(403).send({ error: "Not authorized" });
    }
    req.user = credentials.user;
    next();
  });
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const swaggerOptions = {
  definition:{
    openapi:'3.0.1',
    info:{
      title: "Documentacion Tienda Online",
      description: "API Tienda Online, Demostración de documentación creada con Swagger",

    }
  },
  apis:[`${__dirname}/docs/**/*.yaml`]
}

export const transportGmailNodemailer = transportGmail