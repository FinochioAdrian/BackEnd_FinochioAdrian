export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAll = async () => {
    let result = await this.dao.getAll();
    return result;
  };
  getById = async (id) => {
    let result = await this.dao.getById(id);
    return result;
  };
  add = async (products) => {
    let result = await this.dao.add(products);
    return result;
  };
  addNewProductInCartById = async (cartId, productID, quantity) => {
    let result = await this.dao.addNewProductInCartById(
      cartId,
      productID,
      quantity
    );
    return result;
  };
  updateOneProductInCart = async (cartId, productID, quantity) => {
    let result = await this.dao.updateOneProductInCart(
      cartId,
      productID,
      quantity
    );
    return result;
  };
  updateAllProductsInCart = async (cartId, products) => {
    let result = await this.dao.updateAllProductsInCart(cartId, products);
    return result;
  };
  removeProductInCartById = async (cartId, productID) => {
    let result = await this.dao.removeProductInCartById(cartId, productID);
    return result;
  };
  update = async (id, data) => {
    let result = await this.dao.update(id, data);
    return result;
  };
  remove = async (id) => {
    let result = await this.dao.remove(id);
    return result;
  };
  getAllWithLimit = async (limit, skip = 0) => {
    let result = await this.dao.getAllWithLimit(limit, (skip = 0));
    return result;
  };
  createCartEmpty = async () => {
    let result = await this.dao.createCartEmpty();
    return result;
  };
}
