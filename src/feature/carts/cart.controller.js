import {
  productsService as Products,
  productsService,
} from "../products/repository/index.js";
import { cartsService as Carts, cartsService } from "./repository/index.js";
import { ticketsService } from "../tickets/repository/tickets.service.js";
import { logger } from '../../utils/loggerMiddleware/logger.js'


//TODO: Agregar middleware de errors, and logger

async function getAll(req, res) {
  try {
    const cartFound = await cartsService.getAll();
    return res.send({ status: "success", payload: cartFound });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send({
      status: "error",
      error: "Error obteniendo el carrito.",
      msg: error.message,
    });
  }
}
async function get(req, res) {
  try {
    const { cid } = req.params;

    const cartFound = await cartsService.getById(cid);
    if (!cartFound) {
      return res
        .status(404)
        .send({ status: "fail", msg: `Cart with ID ${cid} not found.` });
    }

    return res.send({ status: "success", payload: cartFound });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send({
      status: "error",
      error: "Error obteniendo el carrito.",
      msg: error.message,
    });
  }
}

async function create(req, res) {
  try {
    const { body } = req;

    const payload = await Carts.add(body.products);
    return res.status(201).send({ status: "success", payload });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}

async function addProductInCart(req, res) {
  try {
    const { user } = req
    const { cid, pid } = req.params;
    // Buscar el cart
    const cart = await Carts.getById(cid);
    if (!cart) {
      return res.status(404).send({ status: "fail", msg: "Cart no found" });
    }
    // Buscar el producto

    const product = await Products.getById(pid);


    if (!product) {
      return res.status(404).send({ status: "fail", msg: "Product no found" });
    }

    // validar que usuario premiun no pueda añadir a su cart un producto propio
    if (user._id == product.owner._id) {
      return res.status(409).send({ status: "Conflict", msg: "This product is already yours. You cannot add it to your cart." });
    }

    const result = await Carts.addNewProductInCartById(cart._id, product._id);
    if (!result) {
      return res
        .status(400)
        .send({ status: "fail", msg: "Product no insert in cart" });
    }
    return res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}
async function updateQuantityProductInCart(req, res) {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!quantity || isNaN(quantity)) {
      return res.status(404).send({
        status: "fail",
        msg: "Quantity product number in body is required",
      });
    }

    const cart = await Carts.getById(cid);
    if (!cart) {
      return res.status(404).send({ status: "fail", msg: "Cart no found" });
    }
    const product = await Products.getById(pid);

    if (!product) {
      return res.status(404).send({ status: "fail", msg: "Product no found" });
    }

    const result = await Carts.updateOneProductInCart(
      cart._id,
      product._id,
      quantity
    );

    return res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}

// update all products in cart by id param and products array in body,
async function updateProductsInCart(req, res) {
  try {
    const { cid, pid } = req.params;
    const { products } = req.body;

    const cart = await Carts.getById(cid);

    if (!cart) {
      return res.status(404).send({ status: "fail", msg: "Cart no found" });
    }
    const product = await Products.getById(pid);

    if (!products) {
      return res.status(404).send({ status: "fail", msg: "Products no found" });
    }

    const result = await Carts.updateAllProductsInCart(cart._id, products);

    return res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}
async function removeProductInCart(req, res) {
  try {
    const { cid, pid } = req.params;

    const cart = await Carts.getById(cid);
    if (!cart) {
      return res.status(404).send({ status: "fail", msg: "Cart no found" });
    }
    const product = await Products.getById(pid);

    if (!product) {
      return res.status(404).send({ status: "fail", msg: "Product no found" });
    }

    const result = await Carts.removeProductInCartById(cart._id, product._id);

    if (!result) {
      return res.status(400).send({
        status: "fail",
        msg: `No element with _id ${product._id} found in cart`,
      });
    }
    return res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}

async function removeCart(req, res) {
  try {
    const { cid } = req.params;
    const removeResult = await Carts.remove(cid);
    if (!removeResult) {
      return res
        .status(400)
        .send({ status: "fail", msg: `Cart with id ${cid} not removed` });
    }
    return res.send({
      status: "success",
      msg: `Cart with id ${cid} was removed`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}
async function purchase(req, res) {
  try {
    const { email } = req.user;
    const { cid } = req.params;
    const cart = await cartsService.getById(cid);
    if (!cart) {
      if (req.accepts("html")) {
        return res.redirect(req.get("referer"));
      }
      return res.status(404).send({ status: "fail", msg: "Cart no found" });
    }

    let amount = 0;

    const availableProducts = []

    for (let i = cart.products.length - 1; i >= 0; i--) {
      if (cart.products[i].quantity <= cart.products[i].product.stock) {
        //aumento el monto
        amount += cart.products[i].quantity * cart.products[i].product.price
        // resto el stock para luego actualizarlo
        cart.products[i].product.stock -= cart.products[i].quantity
        //inserto una copia en producto validos
        availableProducts.push(cart.products[i]);
        // Elimino el producto del cart
        cart.products.splice(i, 1);
      }
    }

    if (availableProducts.length > 0) {
      //Actulizo los producto en la dbs
      for (const product of availableProducts) {
        try {

          await productsService.update(product.product._id, product.product);

        } catch (error) {
          logger.error("❌ ~ purchase ~ error:", error)
          throw error
        }

      }

      await cartsService.update(cart._id, cart);
      const newcart = await cartsService.getById(cid);

      const ticket = await ticketsService.create({ amount, purchaser: email });



      if (req.accepts("html")) {
        const ticketObject =ticket.toObject()
        return res.render("ticket", { title: "Ticket",ticket:ticketObject, productsPurchase:availableProducts});
      }
      return res.send({
        status: "success",
        payload: { ticket, availableProducts, productsNotPurchase: newcart.products },
      });
    }
    if (req.accepts("html")) {
      return res.redirect(req.get("referer"));
    }
    return res.send({
      status: "success",
      payload: { productsNotPurchase: cart.products },
    });

    

  } catch (error) {
    logger.error("❌ ~ purchase ~ error:", error);

    return res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}
export {
  getAll,
  get,
  create,
  addProductInCart,
  updateProductsInCart,
  updateQuantityProductInCart,
  removeProductInCart,
  removeCart,
  purchase,
};
