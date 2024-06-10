import Products from "./product.model.js";
import {logger} from '../../utils/loggerMiddleware/logger.js'
export default class ProductsDao {
  constructor(){

  }
  getAll = async(limit, page, sort, category, available)=>{

    limit = limit || 10;
    page = page || 1;
    sort = sort || "asc";
    category = category || null;
    available = available || true;

    try {
      const query = { status:available };
      if (category) {
        query.category = category;
      }
      const productsFind = Products.paginate(
        query,
        { page, limit, sort:{price:sort}, lean: true }
      );
      return productsFind;
    } catch (error) {
      logger.error("❌ Error while getting all products " + error);
      throw new Error("Error getting all products ");
    }
  }
   getAllWithStock=async ()=> {
    try {
      return Products.find({ stock: { $gt: 0 } }).lean();
    } catch (error) {
      logger.error("❌ Error get all products with Stock " + error);
      throw new Error("Error get all products with Stock ");
    }
  }
   getWithCode=async (code)=> {
    try {
      const result = await Products.findOne({ code }).lean();
      return result;
    } catch (error) {
      logger.error("❌ Error get  products with Code " + error);
      throw new Error("Error get products with Code ");
    }
  }
   getAllWithLimit=async (limit, skip = 0)=> {
    try {
      return Products.find().skip(skip).limit(limit).lean();
    } catch (error) {
      logger.error("❌ Error get all products with limit " + error);
      throw new Error("Error get all products with limit");
    }
  }
   getById=async (id)=> {
    try {
      
      return Products.findOne({ _id: id }).lean();
    } catch (error) {
      logger.error("❌ Error getting one product " + error);
      throw new Error("Error getting one product");
    }
  }
  //get all products in one array the ids
   getByIdInMatriz=async (productIds)=> {
    try {
      
      return Products.find({ _id: { $in: productIds } }).lean();
    } catch (error) {
      logger.error("❌ Error getting one product " + error);
      throw new Error("Error getting one product");
    }
  }
    add=async(
    productDTO
  ) =>{
    try {
      const newProduct = new Products(
        productDTO
      );

      const savedProduct = await newProduct.save();
      return savedProduct;
    } catch (error) {
      logger.error("❌ Error add product " + error);
      throw new Error("Error add product");
    }
  }
   update=async(id, productDTO) =>{
    try {
      const updateProduct = Products.findByIdAndUpdate(id, productDTO);

      return updateProduct;
    } catch (error) {
      logger.error("❌ Error add product " + error);
      throw new Error("Error add product");
    }
  }
   remove=async(product) =>{
    try {
      const result = await Products.findByIdAndDelete(product._id).lean();

      return result;
    } catch (error) {
      logger.error("❌ Error remove product " + error + " " + error.name);
      throw error; // Re-lanzar el error para que se maneje en el controlador
    }
  }
}


