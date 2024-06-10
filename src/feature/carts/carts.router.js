import express from "express";

import * as CartController from "./cart.controller.js";
import cartValidationMiddleware, {
  runValidation,
} from "./cartValidationMiddleware.js";
import { auth, passportCall } from "../../utils.js";

const router = express.Router();
/* Docs finalizada */
router.get(
  "/",passportCall("jwt"),auth(["admin"]),
  cartValidationMiddleware("getAll"),
  runValidation,
  CartController.getAll
);
/* Docs finalizada */

router.get(
  "/:cid",passportCall("jwt"),auth(["user","premium","admin"]),
  cartValidationMiddleware("isCid"),
  runValidation,
  CartController.get
);

// create new cart

/* Docs finalizada */
router.post(
  "/",passportCall("jwt"),
  auth(["user","premium","admin"]),
  cartValidationMiddleware("createCart"),
  runValidation,
  CartController.create
);


// Add new product in cart by cart id and product id
router.post(
  "/:cid/product/:pid",
  
  passportCall("jwt"),
auth(["user","premium","admin"]),
  cartValidationMiddleware("isCid"),
  cartValidationMiddleware("isPid"),
  runValidation,
  CartController.addProductInCart
);

//update one product in cart by cart id and product id

router.put(
  "/:cid/product/:pid",
  
    
  passportCall("jwt"),
  auth(["user","premium","admin"]),
  cartValidationMiddleware("isCid"),
  cartValidationMiddleware("isPid"),
  runValidation,
  CartController.updateQuantityProductInCart
);

//update all product in cart by cart id
router.put(
  "/:cid",
  passportCall("jwt"),
auth(["user","premium","admin"]),
  cartValidationMiddleware("isCid"),
  runValidation,
  CartController.updateProductsInCart
);
//delete product in cart by  id cart and id product
router.delete(
  "/:cid/product/:pid",
  passportCall("jwt"),
auth(["user","premium","admin"]),

  cartValidationMiddleware("isCid"),
  cartValidationMiddleware("isPid"),
  runValidation,
  CartController.removeProductInCart
);
//delete cart by id
router.delete(
  "/:cid/",passportCall("jwt"),
  auth(["user","premium","admin"]),
  cartValidationMiddleware("isCid"),
  runValidation,
  CartController.removeCart
);

router.post("/:cid/purchase",passportCall("jwt"),
passportCall("jwt"),
auth(["user","premium"]),CartController.purchase)
export default router;
