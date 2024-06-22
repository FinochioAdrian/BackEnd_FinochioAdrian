
import mongoose from "mongoose";
import Users from './feature/users/users.model.js';
const url = "mongodb://localhost:27017/loginClase20"
 
function connectDB(url) {
  
  
  try {
    mongoose.connect(url);
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.info(`⚡️[Database] Database connected: ${url}`);
  });
 
  dbConnection.on("error", (err) => {
    console.error(`❌ connection error: ${err}`);
  });
  
}
/* 
async function asyncForEach(array, callback) {
  for (const item of array) {
    await callback(item);
  }
} */

async function extraerUsauariosInactivos(){
  await connectDB(url)
  
  const allUsers = await getAllUsers()
  console.log("🚀 ~ extraerUsauariosInactivos ~ allUsers:", allUsers)
  const hoy = new Date()
  const usersInactivity = await getAllUsersInactivity(hoy)
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
    return await Users.find({'last_connection.date':{ $lte: date }},{ first_name: 1, last_name: 1, age: 1, email: 1, role: 1 , last_connection:1}).lean();
  } catch (error) {
    console.error("❌ ~ UsersDAO ~ getAllUser ~ error:", error);
    
  }
}

extraerUsauariosInactivos()