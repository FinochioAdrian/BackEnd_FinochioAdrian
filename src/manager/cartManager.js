import fs from "fs";

import crypto from "node:crypto";

class CartManager {
  constructor() {
    this.path = "./carrito.json";
  }
  /* Devuelve un id conformado del timeStamp y valor random crypto */
  newID() {
    const randomValue = crypto.randomBytes(4).toString("hex");
    return `${Date.now().toString(16)}-${randomValue}`;
  }

  async newCart({ products }) {
    if (products.length === 0) {
      const error = new Error("products is empty");
      error.status = 400;
      throw error;
    }

    const cartsExist = await this.getCarts();
    const id = this.newID();

    let cart = {
      id,
      products,
    };

    try {
      await this.writeFile([...cartsExist, cart]);
      return cart;
    } catch (error) {
      console.error(error);
      const err = new Error("Error guardando el producto");
      err.status = 500;
      throw err;
    }
  }

  async getCarts() {
    return this.readFile();
  }

  async getCartById(id) {
    const carts = await this.readFile();
    const foundCart = carts.find((pro) => pro.id === id);

    if (!foundCart) {
      const error = new Error(`El Cart con el Id: ${id} no existe `);
      error.status = 404;
      throw error;
    }

    return foundCart;
  }
  
  async fileExist() {
    try {
      await fs.promises.access(this.path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async readFile() {
    const exist = await this.fileExist();
    if (!exist) return [];

    const cartsJson = await fs.promises.readFile(this.path);
    if (cartsJson.length === 0) {
      return [];
    }
    return JSON.parse(cartsJson);
  }

  

  async updateCartFields(id, productId) {
    const cart = await this.readFile();
    const indexCart = cart.findIndex((cart) => cart.id === id);

    if (indexCart === -1) {
      const error = new Error(`El producto con el Id: ${id} no existe `);
      error.status = 404;
      throw error;
    }
    const indexProduct = cart[indexCart].products.findIndex((prod) => {return prod.id == productId})
    ("indexProduct",indexProduct);
    if (indexProduct ==-1){
      cart[indexCart].products.push({id:productId,quantity:1})
    }
    else{
      cart[indexCart].products[indexProduct].quantity++
    }

    
    try {
      await this.writeFile(cart);
      
    } catch (error) {
      console.error(error);
      const err = new Error("Error guardando el producto");
      err.status = 500;
      throw err;
    }
  }

  

  async writeFile(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data));
  }
}

export default CartManager;
