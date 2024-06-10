import { body, param, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";

export default function validate(method) {
  switch (method) {
    case "isCid": {
      return param("cid")
        .exists()
        .withMessage("Search parameter cart 'id' is required")
        .custom((value) => (isValidObjectId(value) ? value : false))
        .withMessage("Search parameter  cart 'id':  is not a valid identifier.");
    }
    case "isPid": {
      return param("pid")
        .exists()
        .withMessage("Search parameter product 'id' is required")
        .custom((value) => (isValidObjectId(value) ? value : false))
        .withMessage("Search parameter product 'id':  is not a valid identifier.");
    }
    case "getAll": {
      return [
        param("limit", "Query params 'Limit' is incorrect").optional().isInt(),
        param("skip", "Query params 'Skip' is incorrect").optional().isInt(),
      ];
    }

    case "createCart": {
      return [
        body("products")
          .isArray({ min: 1 })
          .withMessage(
            "The 'products' field must be an array with at least one element."
          )
          .custom((value) => {
            
            if (
              !value.every((product) => {
                if (!product || typeof product !== "object") {
                  throw new Error("Each product must be a valid object.");
                }

                if (!product.product || !isValidObjectId(product.product)) {
                  throw new Error(
                    'Each product must have a valid MongoDB object ID for "id".'
                  );
                }

                if (
                  !Number.isInteger(product.quantity) ||
                  product.quantity <= 0
                ) {
                  throw new Error(
                    'Each product must have a valid positive integer "quantity".'
                  );
                }

                return true;
              })
            ) {
              throw new Error(
                'All products must be valid objects with correct "_id", "quantity", and other properties.'
              );
            }
            return true
          }),
      ];
    }
   
  }
}

export const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ errors: errors.array().map((val) => val.msg) });
  }
  next();
};
