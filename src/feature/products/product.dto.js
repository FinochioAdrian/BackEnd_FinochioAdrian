export default class ProductDTO {
  constructor(product) {
    this._id=product._id
    this.title = product.title;
    this.description = product.description;
    this.code = product.code;
    this.price = product.price;
    this.status = product.status;
    this.stock = product.stock;
    this.category = product.category;
    this.thumbnails = product.thumbnails;
    this.owner = product.owner
    
  }
}
