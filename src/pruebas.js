import connectDB from './config/db.config.js'
import ProductsDao from './feature/products/product.dao.js';
import ProductsModel from './feature/products/product.model.js';
import ProductManager from './manager/productManager.js';
import CartManager from './manager/cartManager.js';
import CartDao from './feature/carts/cart.dao.js';
import { logger } from './utils/loggerMiddleware/logger.js';
async function enviromentPrueba (){

    await connectDB()


const category = null
const status = true
    await obtnerProductos(category,status)
     
    /* await cargarCarritoAtlas() */
   /*  await cargarProductosAtlas() */
   

    
}
const obtnerProductos = async (category,status) => {
  const query = {status}
  if (category){
    query.category=category
  }
  const result = await ProductsModel.find(query)
}

 const cargarCarritoAtlas = async ()=> {
  
  const cm = new CartManager()
  const cartJSON = await cm.getCarts()
  await asyncForEach(cartJSON, async (item) => {
    
    await guardarCartEnAtlas(item);
  });

}
 const cargarProductosAtlas = async ()=> {
  const pm = new ProductManager()
  const productsJSON = await pm.getProducts()
  await asyncForEach(productsJSON, async (item) => {
    
    await guardarProductosEnAtlas(item);
  });

}

const guardarCartEnAtlas = async({products}) => {
  try {
    
    let result = await CartDao.add(products)
    
  } catch (error) {
    logger.error("❌ ~ guardarEnAtlas ~ error:", error)
    
  }
  
}
const guardarProductosEnAtlas = async({title,description,price,thumbnail,code,stock,status,category='IT'}) => {
  try {
    let result = await ProductsDao.add({title,description,code,price,stock,status,category,thumbnail})
    
  } catch (error) {
    logger.error("❌ ~ guardarEnAtlas ~ error:", error)
    
  }
  
}

enviromentPrueba()


async function asyncForEach(array, callback) {
  for (const item of array) {
    await callback(item);
  }
}



