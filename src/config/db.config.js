import mongoose from "mongoose";
import { logger } from "../utils/loggerMiddleware/logger";
 
 export default function connectDB(url) {
  
  
  try {
    mongoose.connect(url);
  } catch (err) {
    logger.error(`❌ ${err.message}`);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    logger.info(`⚡️[Database] Database connected: ${url}`);
  });
 
  dbConnection.on("error", (err) => {
    logger.error(`❌ connection error: ${err}`);
  });
  
}