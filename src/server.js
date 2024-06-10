import { logger } from "./utils/loggerMiddleware/logger.js";


export default function Server (app,port=8080){
    
     const httpServer = app.listen(port, () => {
        logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
      });
      return httpServer
}


