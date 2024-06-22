import connectDB from './config/db.config.js'
import ProductsDao from './feature/products/products.dao.js';
import ProductsModel from './feature/products/product.model.js';
import ProductManager from './manager/productManager.js';
import CartManager from './manager/cartManager.js';
import CartDao from './feature/carts/cart.dao.js';
import Users from './feature/users/users.model.js';
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
    console.error("❌ ~ guardarEnAtlas ~ error:", error)
    
  }
  
}
const guardarProductosEnAtlas = async({title,description,price,thumbnail,code,stock,status,category='IT'}) => {
  try {
    let result = await ProductsDao.add({title,description,code,price,stock,status,category,thumbnail})
    
  } catch (error) {
    console.error("❌ ~ guardarEnAtlas ~ error:", error)
    
  }
  
}



async function asyncForEach(array, callback) {
  for (const item of array) {
    await callback(item);
  }
}

async function extraerUsauariosInactivos(){
  await connectDB()
  
  const allUsers = await getAllUsers()
  console.log("🚀 ~ extraerUsauariosInactivos ~ allUsers:", allUsers)
  const usersInactivity = await getAllUsersInactivity()
  console.log("🚀 ~ extraerUsauariosInactivos ~ usersInactivity:", usersInactivity)




}

async function getAllUsers() {
  try {
    return await Users.find({},{ first_name: 1, last_name: 1, age: 1, email: 1, role: 1 , last_connection:1}).lean();
  } catch (error) {
    console.error("❌ ~ UsersDAO ~ getAllUser ~ error:", error);
    
  }
}
async function getAllUsersInactivity(date) {
  try {
    return await Users.find({'last_connection.date':{ $lt: date }},{ first_name: 1, last_name: 1, age: 1, email: 1, role: 1 , last_connection:1}).lean();
  } catch (error) {
    console.error("❌ ~ UsersDAO ~ getAllUser ~ error:", error);
    
  }
}

extraerUsauariosInactivos()