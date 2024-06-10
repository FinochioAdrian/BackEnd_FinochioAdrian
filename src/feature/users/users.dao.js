import Users from "./users.model.js";
import CartDao from "../carts/cart.dao.js"
import { logger } from "../../utils/loggerMiddleware/logger.js";

const cartDao = new CartDao()
// UsersDAO class
export default class UsersDAO {
  constructor() { }
  // find all user
  async getAllUsers() {
    try {
      return await Users.find().lean();
    } catch (error) {
      logger.error("❌ ~ UsersDAO ~ getAllUser ~ error:", error);
      throw error;
    }
  }

  // get user by email
  async getUserByEmail(user) {
    try {
      // find user by email
      return await Users.findOne({ email: user.email }).lean();
    } catch (error) {
      logger.error("❌ ~ UsersDAO ~ getUserByEmail ~ error:", error);
      throw error;
    }
  }

  // get user by credentials
  async getUserByCreds(user) {
    try {
      const { email, password } = user
      // find user by email and password
      return await Users.findOne({ email, password }).lean();
    } catch (error) {
      logger.error("❌ ~ UsersDAO ~ getUserByCreds ~ error:", error);
      throw error;
    }
  }

  // insert new user
  async insert(userData) {
    try {
      const cart = await cartDao.createCartEmpty()
      userData.cart = cart._id
      // save new user to database
      const newuser = await new Users(userData).save();
      //save cart in the dbs
      if (newuser) {
        await cart.save()
        return newuser

      }
      return newuser
    } catch (error) {
      logger.error("❌ ~ UsersDAO ~ insert ~ error:", error);
      throw error;
    }
  }

  // get user by id
  async getUserByID(user) {
    try {
      // find user by id and select specific fields
      return await Users.findOne(
        { _id: user?.id || user._id },
        { first_name: 1, last_name: 1, age: 1, email: 1, role: 1 }
      ).lean();
    } catch (error) {
      logger.error("❌ ~ UsersDAO ~ getUserByID ~ error:", error);
      throw error;
    }
  }

  async newPassword(user) {
    try {
      return await Users.findOneAndUpdate({ email: user.email }, { password: user.password }).lean()
    } catch (error) {
      logger.error("❌ ~ newPassword ~ error:", error);
      throw error;
    }
  }
  async updateUser(user) {
    try {
      const result = await Users.findOneAndUpdate({ _id: user?.id || user._id }, user, { new: true }).lean()
      return result
    } catch (error) {
      logger.error("❌ ~ newPassword ~ error:", error);
      throw error;
    }
  }
  async updateLast_connection(user) {

    try {

      const result = await Users.findOneAndUpdate(
        { _id: user?.id || user._id },
        { $set: { last_connection: user.last_connection } },
        { new: true }
      ).lean();

    


      return result
    } catch (error) {
      logger.error("❌ ~ newPassword ~ error:", error);
      throw error;
    }
  }
  async updateDocumentation(user) {

    try {

      const result = await Users.findOneAndUpdate(
        { _id: user?.id || user._id },
        { $set: { documents: user.documents } },
        { new: true }
      ).lean();

    


      return result
    } catch (error) {
      logger.error("❌ ~ newPassword ~ error:", error);
      throw error;
    }
  }

}

