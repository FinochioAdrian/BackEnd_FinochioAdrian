import fs from "fs";
import crypto from "node:crypto";

class ProductManager {
  

  constructor() {
    
    this.path = "./productos.json";
  }
  /* Devuelve un id conformado del timeStamp y valor random crypto */
  newID() {
    const randomValue = crypto.randomBytes(4).toString("hex");
    return `${Date.now().toString(16)}-${randomValue}`;
  }

  async addProduct({
    title,
    description,
    price,
    thumbnail = [],
    code,
    stock,
    status = true,
  }) {
    if (
      [title, description, price, status, code, stock].some((field) => !field)
    ) {
      const error = new Error(
        "Todos los campos son obligatorios 'title, description, price, status, code, stock'"
      );
      error.status = 400;
      throw error;
    }
    const productsExist = await this.getProducts();
    
    if (productsExist.some((prod) => prod.code === code)) {
      const error = new Error(`El Producto: ${title} existe con el code: ${code}`);
      error.status = 400;
      throw error;
    }
    const id = this.newID();

    let product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
    };
    
    
    try {
      await this.writeFile([...productsExist, product]);
      return product;
    } catch (error) {
      console.error(error);
      const err = new Error("Error guardando el producto");
      err.status = 500;
      throw err;
    }
  }

  async getProducts() {
    return this.readFile();
  }

  async getProductById(id) {
    const products = await this.readFile();
    const foundProduct = products.find((pro) => pro.id === id);

    if (!foundProduct) {
      const error = new Error(`El producto con el Id: ${id} no existe `);
      error.status = 404;
      throw error;
    }

    return foundProduct;
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

    const productsJson = await fs.promises.readFile(this.path);
    if (productsJson.length===0){
      return []
    }
    
    return JSON.parse(productsJson);
  }

  async deleteProductByID(id) {
    const products = await this.getProducts();

    if (!products.some((prod) => prod.id === id)) {
      const error = new Error(`El producto con el Id: ${id} no existe `);
      error.status = 404;
      throw error;
    }

    const filteredProducts = products.filter((pro) => pro.id !== id);
    try {
      await this.writeFile(filteredProducts);
    } catch (error) {
      console.error(error);
      const err = new Error("Error guardando el producto");
      err.status = 500;
      throw err;
    }
  }

  async updateProductFields(id, updatedFields) {
    const products = await this.readFile();
    const index = products.findIndex((pro) => pro.id === id);

    if (index === -1) {
      const error = new Error(`El producto con el Id: ${id} no existe `);
      error.status = 404;
      throw error;
    }

    const updatedProduct = { ...products[index], ...updatedFields };
    products[index] = updatedProduct;
    try {
      await this.writeFile(products);
      return updatedProduct;
    } catch (error) {
      console.error(error);
      const err = new Error("Error guardando el producto");
      err.status = 500;
      throw err;
    }
  }

  async updateProduct({ id, ...product }) {
    await this.updateProductFields(id, product);
  }

  async writeFile(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data));
  }

  
}

export default ProductManager;
