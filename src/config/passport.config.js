import passport from "passport";
import local from "passport-local";
import {usersService} from "../feature/users/repository/users.service.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from "passport-jwt";
import GitHubStrategy from "passport-github2";
import envConfig from "./config.js";
import UserDto from "../feature/users/user.dto.js";

import { logger } from "../utils/loggerMiddleware/logger.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;


const PRIVATE_KEY_JWT = envConfig.PRIVATE_KEY_JWT;
const CLIENT_ID_GITHUB = envConfig.CLIENT_ID_GITHUB;
const CLIENT_SECRET_GITHUB = envConfig.CLIENT_SECRET_GITHUB;
const CALLBACK_URL_GITHUB = envConfig.CALLBACK_URL_GITHUB;

const initializePassport = () => {
  // Passport Local register
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        if (
          !username ||
          !first_name ||
          !last_name ||
          !email ||
          !age ||
          !password
        ) {
          return done(null, false, {
            type: "errorEmptyField",
            message: "Oops! It looks like you missed a few fields.",
          });
        }
        try {
          let user = await usersService.getUserByEmail(username);
          if (user) {
            return done(null, false, {
              type: "errorValidation",
              message: "The email address you entered is already in use.",
            });
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "user",
          };
          let result = await usersService.insert(newUser);
          return done(null, result);
        } catch (error) {
          logger.error("❌ ~passport.config - register - error:", error);
          return done("Error al registrar el usuario: " + error);
        }
      }
    )
  );
  //Passport local login
  passport.use(
    "local-login",
    new LocalStrategy(
      { usernameField: "email", session: false },
      async (username, password, done) => {
        try {
          
          const user = await usersService.getUserByEmail(username);
          
          if (!user) {
            return done(null, false, {
              type: "errorValidation",
              message:
                "No account exists with the email address or username you entered",
            });
          }
          if (!isValidPassword(user, password))
            return done(null, false, {
              type: "errorValidation",
              message: "Password is invalid",
            });
          delete user.password;
          return done(null, user);
        } catch (error) {
          logger.error("❌ ~ passport.use ~ login ~ error:", error);
        }
      }
    )
  );

  // Passport JWT
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY_JWT,
      },
      async (jwt_payload, done) => {
        try {
          const user = new UserDto(jwt_payload.user)
          
          
          return done(null, {...user});
        } catch (error) {
          logger.error("❌ ~ initializePassport ~ error:", error);
          return done(error);
        }
      }
    )
  );
  // Passport Github Login and Register
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: CLIENT_ID_GITHUB,
        clientSecret: CLIENT_SECRET_GITHUB,
        callbackURL: CALLBACK_URL_GITHUB,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
       

        const email =
          profile?.emails[0].value ||
          profile._json.id + profile._json.login + "@github.com";
        try {
          let user = await usersService.getUserByEmail(email);
          if (!user) {
            
            let user = await usersService.insert({
              first_name: profile._json.name,
              age: 18,
              email,
            });
            delete user.password;
            return done(null, user);
          } else {
            delete user.password;
            done(null, result);
          }
        } catch (error) {
          logger.error("❌ ~ error:", error);
          done(error);
        }
      }
    )
  );
};

function cookieExtractor(req) {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies["jwt"];
  }
  
  return token;
}

export default initializePassport;
