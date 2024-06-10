import { logger } from "../../utils/loggerMiddleware/logger.js";
import Messages from "./messages.model.js";

export default class MessagesDao {
  constructor (){

  }
  async getAll() {
    try {
      return Messages.find().lean();
    } catch (error) {
      logger.error(" ❌ ~ MessagesDao ~ getAll ~ error:", error);
      throw err;
    }
  }
  async getById(id) {
    try {
      return Messages.find({ _id: id }).lean();
    } catch (error) {
      logger.error(" ❌ ~ MessagesDao ~ getById ~ error:", error);
      throw err;
    }
  }
  async getByUser(userMail) {
    try {
      return Messages.find({ user: userMail }).lean();
    } catch (error) {
      logger.error(" ❌ ~ MessagesDao ~ getByUser ~ error:", error);
      throw err;
    }
  }
  async add(userMail, message) {
    try {
      const newMessage = new Messages({ user: userMail, message });
      return newMessage.save();
    } catch (error) {
      logger.error(" ❌ ~ MessagesDao ~ add ~ error:", error);
      throw err;
    }
  }
  async addMany(collection) {
    try {
      const newMessage = await Messages.insertMany(collection);
      return newMessage;
    } catch (error) {
      logger.error(" ❌ ~ MessagesDao ~ add ~ error:", error);
      throw error;
    }
  }

  async addNewMessageByUserMail(userMail, message) {
    try {
      const result = await Messages.findOneAndUpdate(
        { user: userMail },
        { $set: { message: "message" + " /n " + message } },
        { new: true }
      ).lean();

      if (!result) {
        // Si no se encontró un carrito con el producto, puedes agregar el producto al carrito aquí
        const addMessages = await this.add(userMail, message);
        return addMessages;
      }

      return result;
    } catch (error) {
      console.error(
        "Error al agregar o actualizar el message en el chat:",
        error
      );
      throw error;
    }
  }
  async update(id, message) {
    try {
      return Messages.findOneAndUpdate({ _id: id }, message);
    } catch (error) {
      logger.error(" ❌ ~ MessagesDao ~ update ~ error:", error);
      throw error;
    }
  }
  async remove(id) {
    try {
      return Messages.findByIdAndDelete(id);
    } catch (error) {
      logger.error(" ❌ ~ MessagesDao ~ remove ~ error:", error);
      throw error;
    }
  }
  async removeByUser(userMail) {
    try {
      return Messages.findAndDelete({ user: userMail });
    } catch (error) {
      logger.error(" ❌ ~ MessagesDao ~ removeByUser ~ error:", error);
      throw error;
    }
  }
}
