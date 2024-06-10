import winston, { format } from "winston";

import envConfig from "../../config/config.js";

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'cyan',
        debug: 'white',

    }

}



export const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: envConfig.ENTORNO == "production"?'info':'debug',
            format: winston.format.combine(winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple(),winston.format.errors({stack:true})),
                
        }),

        new winston.transports.File({ filename: './errors.log', level: "warning", format: winston.format.combine(winston.format.timestamp(), format.json()) }),

    ]
})

 
//TODO implementar loggerProduction and loggerDevelopment
export const addLogger = (req, res, next) => {

    req.logger = logger
    req.logger.http(`${req.method} en url: ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
}



