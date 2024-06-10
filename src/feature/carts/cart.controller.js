import {
  productsService as Products,
  productsService,
} from "../products/repository/index.js";
import { cartsService as Carts, cartsService } from "./repository/index.js";
import { ticketsService } from "../tickets/repository/tickets.service.js";
import {logger} from '../../utils/loggerMiddleware/logger.js'


//TODO: Agregar middleware de errors, and logger

async function getAll(req, res) {
  try {
   
    const cartFound = await cartsService.getAll();
    return res.send({status:"success", payload:cartFound});
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
    const { cid, pid } = req.params;

    const cart = await Carts.getById(cid);
    if (!cart) {
      return res.status(404).send({ status: "fail", msg: "Cart no found" });
    }
    const product = await Products.getById(pid);

    if (!product) {
      return res.status(404).send({ status: "fail", msg: "Product no found" });
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
    const products = cart.products.map((producto, index, array) => {
      if (producto.quantity <= producto.product.stock) {
        amount += producto.quantity * producto.product.price;
        producto.product.stock -= producto.quantity;
        const productsPurchase = array.splice(index, 1);
        
        return productsPurchase;
      }
    });
    
    let productsPurchase = products[0]||[]
    
    if (productsPurchase.length > 0) {

      for (const product of productsPurchase) {
        try {
          await productsService.update(product.product._id, product.product);
        } catch (error) {
          logger.error("❌ ~ purchase ~ error:", error)
          throw error
        }
   
        
      }
      const cartsUpdate = await cartsService.update(cart._id, cart);
      const newcart = await cartsService.getById(cid);

      const ticket = await ticketsService.create({ amount, purchaser: email });

      return res.send({
        status: "success",
        payload: { ticket, productsPurchase, productsNotPurchase: newcart.products },
      });
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
