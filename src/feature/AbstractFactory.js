// factory.js
import MongoSingleton from "../config/mongoSingleton.js";
import config from "../config/config.js";

class DAOFactory {
  static #instance;

  constructor() {
    if (new.target === DAOFactory) {
      throw new Error("Cannot instantiate abstract class.");
    }
    if (DAOFactory.#instance) {
      return DAOFactory.#instance;
    }
    DAOFactory.#instance = this;
  }

  static async getInstance() {
    if (!DAOFactory.#instance) {
      DAOFactory.#instance = new DAOFactory();
      await DAOFactory.#instance.initialize();
    }
    return DAOFactory.#instance;
  }

  async initialize() {
    throw new Error("Method 'initialize' must be implemented in subclasses.");
  }

  getProductsDao() {
    throw new Error("Method 'getProductsDao' must be implemented in subclasses.");
  }

  getCartsDao() {
    throw new Error("Method 'getCartsDao' must be implemented in subclasses.");
  }
}


// mongoDAOFactory.js

class MongoDAOFactory extends DAOFactory {
  #productsDao;
  #cartsDao;

  async initialize() {
    const { default: ProductsMongoDAO } = await import(
      "./products/products.dao.js"
    );
    const { default: CartsMongoDAO } = await import("./carts/cart.dao.js");
    this.#productsDao = ProductsMongoDAO;
    this.#cartsDao = CartsMongoDAO;
  }

  getProductsDao() {
    if (!this.#productsDao) {
      throw new Error("ProductsDao not initialized. Call initialize() first.");
    }
    return this.#productsDao;
  }

  getCartsDao() {
    if (!this.#cartsDao) {
      throw new Error("CartsDao not initialized. Call initialize() first.");
    }
    return this.#cartsDao;
  }
}

// index.js

const factory = new MongoDAOFactory();
await factory.initialize();

const productsDao = factory.getProductsDao();
const cartsDao = factory.getCartsDao();

// Ahora puedes usar productsDao y cartsDao según sea necesario
