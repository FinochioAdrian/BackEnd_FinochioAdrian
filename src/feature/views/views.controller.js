import jwt from "jsonwebtoken";

import { productsService as Products } from "../products/repository/index.js";
import { cartsService } from "../carts/repository/index.js";
import { logger } from "../../utils/loggerMiddleware/logger.js";
import envConfig from "../../config/config.js"
import { usersService as Users } from "../users/repository/users.service.js";
async function getHome(req, res) {
  try {
    const user = req.user;

    return res.render("home", { title: "home", user });
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message });
  }
}
async function getProducts(req, res) {
  try {
    const limit = req.query?.limit || 10;
    const page = req.query?.page || 1;
    const sort = req.query?.sort || "asc";
    const category = req.query?.category || null;
    const available = req.query?.available || true;

    let result = await Products.getAll(limit, page, sort, category, available);

    result.prevLink = result.hasPrevPage
      ? `../products?page=${result.prevPage}&limit=${result.limit}${category ? "&category=" + category : ""
      }${sort ? "&sort=" + sort : ""}${!available ? "&available=" + available : ""
      }`
      : null;
    result.nextLink = result.hasNextPage
      ? `../products?page=${result.nextPage}&limit=${result.limit}${category ? "&category=" + category : ""
      }${sort ? "&sort=" + sort : ""}${!available ? "&available=" + available : ""
      }`
      : null;

    const user = req.user;

    return res.render("products", { title: "Products", result, user });
  } catch (error) {
    return res.status(error.status || 500).send(`<h1>${error.message} </h1>`);
  }
}
async function getProduct(req, res) {
  try {
    const user = req.user;
    const { pid } = req.params;

    if (!pid) {

      return res.redirect("/products");
    }
    let product = await Products.getById(pid);


    if (!product) {

      return res.redirect("/products");
    }

    return res.render("product", { title: "Product", product, user });
  } catch (error) {
    logger.error("❌ ~ product ~ error:", error);
  }
}
async function adminUsers(req, res) {
  try {
    const user = req.user;
    const usuarios = await Users.getAllUsers()

    return res.render("adminUsers", { title: "Administrar Usuarios", usuarios: usuarios, user });
  } catch (error) {
    logger.error("❌ ~ product ~ error:", error);
    next(error)

  }
}
async function adminUsers_modificarRol(req, res, next) {
  try {
    const { uid } = req.params

    const user = await Users.getUserByID(uid)

    user.role = user.role == "user" ? "premium" : "user"

    const savedUser = await Users.update(user)

    return res.redirect(`/adminUsers`);
  } catch (error) {
    logger.error("❌ ~ product ~ error:", error);
    next(error)
  }
}
async function adminUsers_delete(req, res, next) {
  try {
    const { uid } = req.params

    const user = await Users.getUserByIdAllData(uid)



    const result = await Users.deleteUser(user)



    return res.redirect(`/adminUsers`);
  } catch (error) {
    logger.error("❌ ~ product ~ error:", error);
    next(error)
  }
}

async function getRealTimeProducts(req, res) {
  return res.render("realTimeProducts", { title: "realTimeProducts" });
}
async function getCarts(req, res) {
  const { cid } = req.params;

  const referer = req.get("referer") || "/products";

  if (!cid) {
    return res.redirect(referer);
  }

  const cartFound = await cartsService.getById(cid);

  if (!cartFound) {
    return res.redirect(referer);
  }
  let quantity = 0
  let amount = 0;

  const availableProducts = []

  for (let i = cartFound.products.length - 1; i >= 0; i--) {
    quantity += cartFound.products[i].quantity
    amount += cartFound.products[i].quantity * cartFound.products[i].product.price


  }

  return res.render("carts", { result: cartFound, quantity, amount });
}
async function postProductInCart(req, res) {
  try {    
    const { user } = req
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    console.log("🚀 ~ postProductInCart ~ req:", user)

    const referer = req.get("referer") || "/products";

    if (!cid || !pid) {
      return res.redirect(referer);
    }
    // Buscar el cart y Buscar el producto
    const cartFound = await cartsService.getById(cid);
    const product = await Products.getById(pid);

    if (!cartFound | !product) {
      return res.redirect(referer);
    }

     // validar que usuario premiun no pueda añadir a su cart un producto propio

     if (user._id == product.owner._id) {
      i
        return res.redirect(referer);
     
     
    }



    const result = await cartsService.addNewProductInCartById(cartFound._id, product._id,quantity??1);

    if (!result) {
      return res.redirect(referer);
    }


    return res.redirect(`/carts/${cid}`);
  } catch (error) {
    logger.error("❌ ~ postProductInCart ~ error:", error)

  }
}

async function getChat(req, res) {
  const { email } = req.user

  return res.render("chat", {
    stylesheet: "/css/chat.css",
    title: "Chat con Socket.IO",
    email
  });
}

async function getAddProducts(req, res) {
  return res.render("addProducts", { title: "addProducts" });
}

async function getLogin(req, res) {
  try {

    // render login page with message if there is
    const errorMessage = req.flash("error");
    const errorValidation = req.flash("errorValidation");
    const emptyField =
      errorMessage[0] == "Missing credentials"
        ? ["Oops! It looks like you missed a few fields."]
        : req.flash("errorEmptyField");

    const infoMSG = req.flash("infoMsg");
    if (req.user) {
      return res.redirect("/products");
    } else {
      return res.render("login", {
        dangerMsg: errorValidation,
        warningMSG: emptyField,
        infoMSG,
        stylesheet: "/css/login.css",
      });
    }
  } catch (error) {
    logger.error("❌  ~ router.post ~ error:", error);
    return res.status(error?.status || 500).send("Internal Server error");
  }
}

async function getRegister(req, res) {
  try {
    const errorMessage = req.flash("error");
    const errorValidation = req.flash("errorValidation");
    const emptyField =
      errorMessage[0] == "Missing credentials"
        ? ["Oops! It looks like you missed a few fields."]
        : req.flash("errorEmptyField");

    return res.render("register", {
      dangerMsg: errorValidation,
      warningMSG: emptyField,
      stylesheet: "/css/login.css",
    });
  } catch (error) {
    logger.error("❌ ~ router.post ~ error:", error);
    return res.status(error?.status || 500).send("Internal Server error");
  }
}
async function getChatBot(req, res) {
  return res.render("chatBot", {
    stylesheet: "/css/chat.css",
    title: "ChatBot con Socket.IO",
  });
}
async function getPasswordReset(req, res) {
  try {
    const authHeader = req.query.token;

    if (!authHeader) {
      if (req.accepts("html")) return res.redirect("/login");
      return res.status(403).send({ error: "Not authorized", redirect: "/login" });
    }
    let token = authHeader;
    if (authHeader.includes("Bearer")) {
      token = authHeader.split(" ")[1];

    }

    jwt.verify(token, envConfig.PRIVATE_KEY_JWT, (err) => {
      if (err) {
        if (req.accepts("html")) return res.redirect("/findEmail");
        return res.status(403).send({ error: "Not authorized", redirect: "/findEmail" });
      }

    });



    // render login page with message if there is
    const errorMessage = req.flash("error");
    const errorValidation = req.flash("errorValidation");
    const emptyField =
      errorMessage[0] == "Missing credentials"
        ? ["Oops! It looks like you missed a few fields."]
        : req.flash("errorEmptyField");

    return res.render("passwordReset", {
      dangerMsg: errorValidation,
      warningMSG: emptyField,
      stylesheet: "/css/login.css",
      token
    });

  } catch (error) {
    logger.error("❌ ~ router.post ~ error:", error);
    return res.status(error?.status || 500).send("Internal Server error");
  }
}
async function findEmail(req, res) {
  try {
    // render login page with message if there is
    const errorMessage = req.flash("error");
    const errorValidation = req.flash("errorValidation");
    const emptyField =
      errorMessage[0] == "Missing credentials"
        ? ["Oops! It looks like you missed a few fields."]
        : req.flash("errorEmptyField");

    return res.render("findEmail", {
      dangerMsg: errorValidation,
      warningMSG: emptyField,
      stylesheet: "/css/login.css",
    });

  } catch (error) {
    logger.error("❌ ~ router.post ~ error:", error);
    return res.status(error?.status || 500).send("Internal Server error");
  }
}
export {
  getHome,
  getProducts,
  getProduct,
  getRealTimeProducts,
  getCarts,
  postProductInCart,
  getChat,
  getAddProducts,
  getLogin,
  getRegister,
  getChatBot,
  getPasswordReset,
  findEmail,
  adminUsers,
  adminUsers_modificarRol,
  adminUsers_delete
};
