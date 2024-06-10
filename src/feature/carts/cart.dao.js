import { logger } from "../../utils/loggerMiddleware/logger.js";
import ProductsDao from "../products/products.dao.js";

import Cart from "./cart.model.js";

const productsService = new ProductsDao()
class CartDao {
  constructor(){

  }
  getAll = async () => {
    return await Cart.find().lean();
  };
  getById = async (id) => {
    const result = await Cart.findOne({ _id: id }).populate("products.product").lean()
    return result
  };
  add = async (products) => {
    const uniqueProductIds = new Set(
      products.map((product) => product.product)
    );

    if (uniqueProductIds.size !== products.length) {
      // Duplicados encontrados, manejar el error
      const error = new Error("Duplicates found in the products array");
      error.status = 422;
      throw error;
    }
    const productsFind = await productsService.getByIdInMatriz(
      Array.from(uniqueProductIds)
    );
    if (uniqueProductIds.size !== productsFind.length) {
      const error = new Error(`Product ID(s) in the query body do not exist`);
      error.status = 422;
      throw error;
    }

    const newCart = new Cart({ products });
    await newCart.save();
    return newCart;
  };
  addNewProductInCartById = async (cartId, productID, quantity = 1) => {
    try {
      const result = await Cart.findOne({
        _id: cartId,
        "products.product": productID,
      });

      if (!result) {
        // Si no se encontró un carrito con el producto, agregar el producto al carrito aquí
        const updatedCart = await Cart.findOneAndUpdate(
          { _id: cartId },
          { $push: { products: { product: productID, quantity } } },
          { new: true }
        );
        return updatedCart;
      } else {
        const updatedCart = await this.updateOneProductInCart(
          cartId,
          productID,
          quantity
        );
      }

      return result;
    } catch (error) {
      console.error(
        "Error al agregar o actualizar producto en el carrito:",
        error
      );
      throw error;
    }
  };
  updateOneProductInCart = async (cartId, productID, quantity) => {
    try {
      const result = await Cart.findOneAndUpdate(
        { _id: cartId, "products.product": productID },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      ).lean();

      return result;
    } catch (error) {
      console.error(
        "Error al agregar o actualizar producto en el carrito:",
        error
      );
      throw error;
    }
  };
  updateAllProductsInCart = async (cartId, products) => {
    try {
      const uniqueProductIds = new Set(products.map((product) => product._id));

      if (uniqueProductIds.size !== products.length) {
        // Duplicados encontrados, manejar el error
        throw new Error("Duplicados encontrados en la matriz de productos");
      }

      const result = await Cart.findOneAndUpdate(
        { _id: cartId },
        { $set: { products: products } },
        { new: true }
      ).lean();

      return result;
    } catch (error) {
      console.error(
        "Error al agregar o actualizar producto en el carrito:",
        error
      );
      throw error;
    }
  };
  removeProductInCartById = async (cartId, productID) => {
    try {
      const result = await Cart.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: productID } } },
        { new: true }
      ).lean();

      return result;
    } catch (error) {
      console.error(
        "Error al agregar o actualizar producto en el carrito:",
        error
      );
      throw error;
    }
  };
  update = async (id, data) => {
    return Cart.findOneAndUpdate({ _id: id }, data).lean();
  };
  remove = async (id) => {
    return Cart.findByIdAndDelete(id);
  };
  getAllWithLimit = async (limit, skip = 0) => {
    try {
      return Cart.find().skip(skip).limit(limit).lean();
    } catch (error) {
      logger.error("❌Error get all carts with limit " + error);
      throw new Error("Error get all carts with limit");
    }
  };
  createCartEmpty = async () => {
    try {
      const newCart = new Cart();
      return newCart;
    } catch (error) {
      logger.error("❌ Error get all carts with limit " + error);
      throw new Error("Error get all carts with limit");
    }
  };
}
export default CartDao;
