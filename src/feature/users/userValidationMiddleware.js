import { param, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import CustomError from "../../utils/errors/customError.js";
import EErrors from "../../utils/errors/enums.js";
import { logger } from "../../utils/loggerMiddleware/logger.js";

export default function validate(method) {
  switch (method) {
    

    case "isID": {
      return param("uid")
        .exists()
        .withMessage("Search parameter 'id' is required")
        .custom((value) => (isValidObjectId(value) ? value : false))
        .withMessage("Search parameter 'id':  is not a valid identifier.");
    }
   
  }
}

export const runValidation = (req, res, next) => {
  try {
    
    const errors = validationResult(req);

  if (!errors.isEmpty()) {
      let errores = errors.array()
      
      let cause=errors.array().map((val) => val.msg)
      throw new CustomError({name:"VALIDATOR_ERROR",cause,message:"Error try router Products",code:EErrors.INVALID_TYPES_ERROR})
    

  }
  next();
  } catch (error) {
    
      next(error)
  }
  
};
