import express from "express";
import * as ProductsController from "./products.controller.js";
import productValidationMiddleware, { runValidation } from "./productValidationMiddleware.js";
import {uploadProducts} from "../../utils/upload.middleware.js";
import { auth, passportCall } from "../../utils.js";
const router = express.Router();


router.get("/", passportCall("jwt"),auth(["user","admin","premium"]),productValidationMiddleware('getAllQueries'),runValidation ,ProductsController.getAll);

router.get("/mockingproducts", productValidationMiddleware('getAllQueries'),runValidation ,ProductsController.getAllMockingProducts);

router.get("/:pid",passportCall("jwt"),auth(["user","admin","premium"]),productValidationMiddleware('isID'),runValidation, ProductsController.get);

router.post("/",passportCall("jwt"),auth(["admin","premium"]),uploadProducts.array("thumbnails",3), productValidationMiddleware('createProduct'),runValidation,ProductsController.create);

router.put("/:pid",passportCall("jwt"),auth(["admin","premium"]),productValidationMiddleware('updateProduct'),runValidation, ProductsController.update);


router.delete("/:pid",passportCall("jwt"),auth(["admin","premium"]),productValidationMiddleware('isID'),runValidation, ProductsController.remove);
export default router;
