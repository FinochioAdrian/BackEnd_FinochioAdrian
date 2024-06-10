import express from "express";
import swaggerUiExpress from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import __dirname, { errorHandler, swaggerOptions } from "./utils.js";
import handlebars_config from "./config/handlebars.config.js";
import IOconfig from "./config/IO.config.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
// importamos .env
import envConfig from "./config/config.js";
import session from "express-session";
// service session and login
import cookieParser from "cookie-parser";

//envió de mensaje entre vistas
import flash from "connect-flash";

//importamos las rutas
import viewsRouter from "./feature/views/views.router.js";
import productsRouter from "./feature/products/products.router.js";
import cartRouter from "./feature/carts/carts.router.js";
import sessionsRouter from "./feature/sessions/sessions.router.js";
import usersRouter from "./feature/users/users.router.js";
import testRouter from "./feature/tests/test.router.js";
import Server from "./server.js";
import { addLogger } from "./utils/loggerMiddleware/logger.js";

const app = express();

//environment var

const PRIVATE_KEY_COOKIE = envConfig.PRIVATE_KEY_COOKIE;
const PORT = envConfig.PORT;


//Iniciamos el Server

const httpServer = Server(app, PORT);
// Config Server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(PRIVATE_KEY_COOKIE));
//manejo de loggers
app.use(addLogger)
// Configuración de sesión y almacenamiento en MongoDB

app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: PRIVATE_KEY_COOKIE,
    resave: false,
    saveUninitialized: false,
  })
);

// configuración y manejo de session por passport local
initializePassport();
app.use(passport.initialize());

// Mensajes Flash
app.use(flash());
// Manejo de Handlebars
handlebars_config(app);
app.use(express.static(__dirname + "/public"));
// Incio y manejo de swagger
const specs = swaggerJsdoc(swaggerOptions)
app.use('/apidocs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs))
// Routers
app.use("/", viewsRouter);
app.use("/loggerTest", testRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);

//manejo de Socket y chat
IOconfig(httpServer);
// manejo de errores
app.use(errorHandler)
export default app;
