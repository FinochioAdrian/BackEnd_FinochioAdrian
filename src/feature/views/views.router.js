// Import the express module
import express from "express";

import * as ViewsController from "./views.controller.js";

import viewValidatorMiddleware, {
  runValidation,
} from "./viewValidationMiddleware.js";

import { passportCall, auth, authToken } from "../../utils.js";
// Create an express router instance
const router = express.Router();

// Define a GET route for the root URL ("/") that redirects to the "/home" route
router.get("/", (req, res) => res.redirect("/login"));

// Define a GET route for the "/home" URL that renders the home view
router.get("/home", passportCall("jwt"), auth(), ViewsController.getHome);

// Define a GET route for the "/products" URL that validates the query parameters using the viewValidatorMiddleware function
// and then renders the products view
router.get(
  "/products",
  passportCall("jwt"),
  auth(),
  viewValidatorMiddleware("getAllQueries"),
  runValidation,
  ViewsController.getProducts
);

// Define a GET route for the "/product/:pid" URL that renders the product view
router.get(
  "/product/:pid",
  passportCall("jwt"),
  auth(),
  ViewsController.getProduct
);
// Define a GET route for the "/adminUsers" URL that renders the panel adminUser  view
router.get(
  "/adminUsers",
  passportCall("jwt"),
  auth(['admin']),
  ViewsController.adminUsers
);

// Define a GET route for the "/adminUsers/modificarRol/:uid"  this URL modify rol user between user and premium
router.get(
  "/adminUsers/modificarRol/:uid",
  passportCall("jwt"),
  auth(['admin']),
  viewValidatorMiddleware("isID"),
  runValidation,
  ViewsController.adminUsers_modificarRol
);

// Define a GET route for the "/adminUsers/delete/:uid" this URL deleted one user by user id :UID
router.get(
  "/adminUsers/delete/:uid",
  passportCall("jwt"),
  auth(['admin']),
  ViewsController.adminUsers_delete
);

// Define a GET route for the "/realTimeProducts" URL that renders the realTimeProducts view
router.get(
  "/realTimeProducts",
  passportCall("jwt"),
  auth(["admin","premium"]),
  ViewsController.getRealTimeProducts
);

// Define a GET route for the "/carts/:cid" URL that validates the cart ID using the viewValidatorMiddleware function
// and then renders the carts view
router.get(
  "/carts/:cid",
  passportCall("jwt"),
  auth(),
  viewValidatorMiddleware("isCID"),
  runValidation,
  ViewsController.getCarts
);

// Define a POST route for the "/carts/:cid/product/:pid" URL that validates the cart ID and product ID using the viewValidatorMiddleware function
// and then adds the product to the cart
router.post(
  "/carts/:cid/product/:pid",
  passportCall("jwt"),
  auth(["user"]),
  viewValidatorMiddleware("isCID"),
  runValidation,
  viewValidatorMiddleware("isPID"),
  runValidation,
  ViewsController.postProductInCart
);

// Define a GET route for the "/chat" URL that renders the chat view
router.get("/chat", passportCall("jwt"), auth(["user"]), ViewsController.getChat);

// Define a GET route for the "/addProducts" URL that renders the addProducts view
router.get(
  "/addProducts",
  passportCall("jwt"),
  auth(["admin"]),
  ViewsController.getAddProducts
);

router.get("/login", passportCall("jwt"), ViewsController.getLogin);

router.get("/register", ViewsController.getRegister);

router.get(
  "/chatBot",
  passportCall("jwt"),
  auth(["user"]),
  ViewsController.getChatBot
);

// add desafio 9
router.get("/findEmail", ViewsController.findEmail);

router.get("/password-reset",ViewsController.getPasswordReset);

export default router;
