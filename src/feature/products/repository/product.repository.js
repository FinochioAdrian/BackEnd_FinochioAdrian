import ProductDTO from "../product.dto.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async (limit, page, sort, category, available) => {
    let result = await this.dao.getAll(limit, page, sort, category, available);
    return result;
  };
  getAllWithStock = async () => {
    let result = await this.dao.getAllWithStock();
    return result;
  };
  getWithCode = async (code) => {
    let result = await this.dao.getWithCode(code);
    return result;
  };
  getAllWithLimit = async (limit, skip) => {
    let result = await this.dao.getAllWithLimit(limit, skip);
    return result;
  };
  getById = async (id) => {
    let result = await this.dao.getById(id);
    return result;
  };
  //get all products in one array the ids
  getByIdInMatriz = async (productIds) => {
    let result = await this.dao.getByIdInMatriz(productIds);
    return result;
  };
  add = async (
    product
  ) => {
    let productToInsert = new ProductDTO(product)
    let result = await this.dao.add(productToInsert);
    return result;
  };
  update = async (id, products) => {
    let productToUpdate = new ProductDTO(products)
    let result = await this.dao.update(id, productToUpdate);
    return result;
  };
  remove = async (product) => {
    let productToRemove = new ProductDTO(product)
    let result = await this.dao.remove(productToRemove);
    return result;
  };
}
