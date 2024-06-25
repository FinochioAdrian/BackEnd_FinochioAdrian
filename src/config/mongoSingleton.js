import mongoose from "mongoose";
import envConfig from "./config.js";
import { logger } from "../utils/loggerMiddleware/logger.js";



function connectDB(url) {
  try {
    mongoose.connect(url);
  } catch (err) {
    logger.error("❌ ",err.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    logger.info (`⚡️[Database] Database connected: ${url}`);
  });
  dbConnection.on("error", (err) => {
    logger.error(`❌ connection error: ${err}`);
  });
}

export default class MongoSingleton {
  static #instance;
  static URL = envConfig.MONGO_URL;

  constructor() {
    connectDB(envConfig.MONGO_URL);
  }

  static getInstance() {
    if (this.#instance) {
      logger.info("Already connected");
      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    
    return this.#instance;
  }
}
