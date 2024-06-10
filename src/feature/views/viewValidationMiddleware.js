import { body, param, query, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import fs from "node:fs";

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
          .isString(),
        query("available", "Query params 'available' is incorrect")
          .optional()
          .isString(),
        query("category", "Query params 'category' is incorrect")
          .optional()
          .isString(),
      ];
    }

    case "isPID": {
      return param("pid")
        .exists()
        .withMessage("Search parameter 'id' is required")
        .custom((value) => (isValidObjectId(value) ? value : false))
        .withMessage("Search parameter 'id':  is not a valid identifier.");
    }
    case "isCID": {
      return param("cid")
        .exists()
        .withMessage("Search parameter cart 'id' is required")
        .custom((value) => (isValidObjectId(value) ? value : false))
        .withMessage("Search parameter cart 'id':  is not a valid identifier.");
    }
    
  }
}

export const runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newErrors= errors.array().map((val) => val.msg)
    return res.redirect("/home");
  }
  next();
};
