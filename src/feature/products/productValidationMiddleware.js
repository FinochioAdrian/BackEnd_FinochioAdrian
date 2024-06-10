import { body, param, query, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import fs from "node:fs";
import CustomError from "../../utils/errors/customError.js";
import EErrors from "../../utils/errors/enums.js";
import { logger } from "../../utils/loggerMiddleware/logger.js";

export default function validate(method) {
  switch (method) {
    case "getAllQueries": {
      return [
        query("limit", "Query params 'limit' is incorrect").optional().isInt(),
        query("page", "Query params 'page' is incorrect").optional().isInt(),
        query("sort", "Query params 'sort' is incorrect")
          .optional()
          .isString()
          .isIn(["asc", "desc"])
          .withMessage("Valid option for sort is 'asc','desc' "),
        query("stock", "Query params 'stock' is incorrect")
          .optional()
          .isBoolean(),
        query("available", "Query params 'available' is incorrect")
          .optional()
          .isBoolean(),
        query("category", "Query params 'category' is incorrect")
          .optional()
          .isString(),
      ];
    }

    case "isID": {
      return param("pid")
        .exists()
        .withMessage("Search parameter 'id' is required")
        .custom((value) => (isValidObjectId(value) ? value : false))
        .withMessage("Search parameter 'id':  is not a valid identifier.");
    }
    case "createProduct": {
      return [
        body("title")
          .exists()
          .notEmpty()
          .withMessage("The 'title' field is required.")
          .isString()
          .withMessage("The 'title' field isn´t  string."),
        body("description")
          .notEmpty()
          .withMessage("The 'description' field is required.")
          .isString()
          .withMessage("The 'description' field isn´t  string."),
        body("code")
          .notEmpty()
          .withMessage("The 'code' field is required.")
          .isString()
          .withMessage("The 'code' field isn´t  string."),
        body("price")
          .notEmpty()
          .withMessage("The 'price' field is required.")
          .isFloat()
          .withMessage("The 'code' field isn´t number."),
        body("owner")
          .optional()
          .custom((value, { req }) => {

            

            // Si el valor es un ObjectId válido, se pasa
            if (isValidObjectId(value)) {
              return true;
            }

            // Si no es un ObjectId válido, se rechaza
            return false;
          })
          .withMessage("Search parameter 'owner': is not a valid id identifier ")
        ,
        body("status", "The 'status' isn´t boolean.").customSanitizer(
          (value, { req }) => {
            if (value === "on") {
              req.body.status = true;
            } else {
              req.body.status = false;
            }
            return true;
          }
        ),
        body("stock")
          .notEmpty()
          .withMessage("The 'stock' field is required.")
          .isInt()
          .withMessage("The 'stock' field isn´t integer number."),
        body("category")
          .notEmpty()
          .withMessage("The 'category' field is required.")
          .isString()
          .withMessage("The 'category' field isn´t alphanumeric string."),
      ];
    }
    case "updateProduct": {
      return [
        param("pid")
          .exists()
          .withMessage("Search parameter 'id' is required")
          .custom((value) => (isValidObjectId(value) ? value : false))
          .withMessage("Search parameter 'id':  is not a valid identifier."),

        body("title")
          .exists()
          .notEmpty()
          .withMessage("The 'title' field is required.")
          .isString()
          .withMessage("The 'title' field isn´t  string."),
        body("description")
          .notEmpty()
          .withMessage("The 'description' field is required.")
          .isString()
          .withMessage("The 'description' field isn´t  string."),
        body("code")
          .notEmpty()
          .withMessage("The 'code' field is required.")
          .isString()
          .withMessage("The 'code' field isn´t  string."),
        body("price")
          .notEmpty()
          .withMessage("The 'price' field is required.")
          .isFloat()
          .withMessage("The 'code' field isn´t number."),
        body("status")
          .default(true)
          .isBoolean()
          .withMessage("The 'status' isn´t boolean."),
        body("stock")
          .notEmpty()
          .withMessage("The 'stock' field is required.")
          .isInt()
          .withMessage("The 'stock' field isn´t integer number."),
        body("category")
          .notEmpty()
          .withMessage("The 'category' field is required.")
          .isString()
          .withMessage("The 'category' field isn´t alphanumeric string."),
        body("thumbnails")
          .optional()
          .isArray({ min: 1 })
          .withMessage(
            "The 'thumbnails' field must be an array with at least one element."
          )
          .custom((thumbnails) => {
            if (thumbnails) {
              // Verificar que todos los elementos sean strings
              if (!thumbnails.every((item) => typeof item === "string")) {
                throw new Error(
                  "The 'thumbnails' field must be an array of strings."
                );
              }
            }
            return true;
          }),
      ];
    }
  }
}

export const runValidation = (req, res, next) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const filePath = req.file && req.file.path;
      if (filePath) {
        //elimina el archivo subido
        fs.unlinkSync(filePath).catch((err) => {
          logger.error("❌ ~ runValidation ~ err:",
            "error eliminando el archivo " + filePath + " ",
            err
          );
        });
      }
      let errores = errors.array()

      let cause = errors.array().map((val) => val.msg)
      throw new CustomError({ name: "VALIDATOR_ERROR", cause, message: "Error try router Products", code: EErrors.INVALID_TYPES_ERROR })


    }
    next();
  } catch (error) {

    next(error)
  }

};
