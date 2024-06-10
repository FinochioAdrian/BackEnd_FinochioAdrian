import mongoose from "mongoose";
import EErrors from "./enums.js";
import CustomError from "./customError.js";
import { generateCastErrorInfo } from "./info.js";
import { logger } from "../loggerMiddleware/logger.js";

export default (error, req, res, next) => {
  logger.error("❌ ~ handleError ~ error:", error);

  if (error instanceof mongoose.Error.CastError) {
    console.error("Error de tipo CastError:", error.message);
    error = new CustomError({
      name: "Error Database",
      cause: generateCastErrorInfo(error),
      message: error.message,
      code: EErrors.DATABASE_ERROR,
    });
  }

  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR: {
      if (req.accepts("html")) {
        return res
          .status(error?.status || 422)
          .send(`<h1>Error 422<h1><p>${{ ...error }}</p>`);
      }

      return res.status(422).send({ status: "Error", error: { ...error } });
      break;
    }
    case EErrors.DATABASE_EXCEPTION: {
      if (req.accepts("html")) {
        return res
          .status(error?.status || 409)
          .send(`<h1>Error 409<h1><p>${{ ...error }}</p>`);
      }

      return res.status(error?.status || 409).send({ status: "Error", error: { ...error } });
      break;
    }
    case EErrors.DATABASE_ERROR: {
      if (req.accepts("html")) {
        return res
          .status(error?.status || 422)
          .send(`<h1>Error 422<h1><p>${{ ...error }}</p>`);
      }
      return res.status(422).send({ status: "Error", error: { ...error } });
      break;
    }
    case EErrors.ROUNTING_ERRORS: {
    }
    case EErrors.REFERENCE_ERROR: {
    }
    case EErrors.SYNTAX_ERROR: {
    }
    case EErrors.RANGE_ERROR: {
    }
    case EErrors.URI_ERROR: {
    }
    default: {
      if (req.accepts("html")) {
        return res
          .status(error?.status || 500)
          .send(`<h1>Internal Server error<h1><p>${{ ...error }}</p>`);
      }
      return res.status(error?.status || 500).json({
        status: "Error",
        msg: "Internal Server error",
        error: { ...error },
      });
    }
  }
};
