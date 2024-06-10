import { Server } from "socket.io";
import { productsService } from "../feature/products/repository/index.js";
import { messagesService } from "../feature/messages/repository/messages.service.js";
import validator from "validator";
const { isEmail, isEmpty } = validator;
import Joi from "joi";
import __dirname from "../utils.js";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import sharp from "sharp";
import { logger } from "../utils/loggerMiddleware/logger.js";
const productAddSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number(), Joi.string()),
  title: Joi.string().required(),
  description: Joi.string().required(),
  code: Joi.string().required(),
  price: Joi.number().strict(true).required(),
  status: Joi.boolean().default(true),
  stock: Joi.number().integer().strict(true).required(),
  category: Joi.string().required(),
  thumbnails: Joi.array().items(Joi.binary()),
});

let contadorChat = 1;

const IOinit = (httpServer) => {
  const io = new Server(httpServer);
  let messagesChat = [];
  io.on("connection", (socket) => {
    logger.info("New user is connected");

    socket.on("getProducts", async (data) => {
      try {
        const products = await productsService.getAll();
        //enviar los productos al cliente
        socket.emit("products", products);
      } catch (error) {
        logger.error("❌ ~ socket.on ~ error:", error);
      }
    });

    socket.on("addNewProduct", async (data) => {
      try {
        // Validar el cuerpo de la solicitud contra el esquema
        const validationResult = productAddSchema.validate(data, {
          abortEarly: false,
        });

        if (validationResult.error) {
          logger.error("❌  ~ socket.on ~ validationResult.error:",
            validationResult.error
          );
          const errors = validationResult.error.details.map(
            (error) => error.message
          );
          // Si hay errores de validación, enviar una respuesta con los errores
          return socket.emit("error", {
            status: "error",
            errors,
          });
        }

        try {
          // Guardando de imágenes en el servidor
          const savedImages = await SaveImages(data.thumbnails);

          data.thumbnails = savedImages;
        } catch (error) {
          console.error("Error al subir imágenes:", error);
          // Manejar el error según sea necesario
          throw error;
        }

        await productsService.add({ ...data });
        const products = await productsService.getAll();
        //enviar los productos al cliente
        socket.emit("products", products);
      } catch (error) {
        logger.error("❌ ~ socket.on ~ error:", error);
        socket.emit({ status: "error", error: error.message });
      }
    });

    socket.on("disconnect", () => {
      if (messagesChat.length > 0) guardarChat(messagesChat);
      logger.info("A user disconnected");
    });

    /* //Implemetacion Chat Bot
    const messages = { mail: "", message: "" };
    socket.on("ChatBot-message", async (msg) => {
      socket.emit("ChatBot-message", msg);
      setTimeout(
        async () =>
          socket.emit(
            "res",
            await mensajePredefinido(contadorChat, msg, messages)
          ),
        1500
      );
    }); */

    //implementacion Chat

    socket.on("message", (data) => {
      messagesChat.push(data);
      io.emit("message", data);
    });

    socket.on("login", (data) => {
      socket.emit("messageLogs", messagesChat);
      socket.broadcast.emit("register", data);
    });
  });
};
async function mensajePredefinido(contador, msg, messages) {
  switch (contador) {
    case 1: {
      messages.mail = "";
      messages.message = "";
      contadorChat = 2;
      return "Bienvenido Al ChatBot de tu tienda Online \n Ingrese un mail para poder dar seguimiento a su messages";
    }

    case 2: {
      let estadoValidacion = validarEmail(msg);
      if (!estadoValidacion) {
        return "Ingrese un mail valido";
      }
      messages.mail = msg;
      contadorChat = 3;
    }
    case 3: {
      contadorChat = 4;
      return "Ingrese su consulta ";
    }
    case 4: {
      messages.message = msg;

      try {
        let result = await guardarChat(messages);

        if (!result) {
          return "Su mensaje no pudo ser guardado";
        }
        contadorChat = 1;
        const { mail, message } = messages;
        return `
          Su Correo es: ${mail} \n 
          Su consulta es : ${message} \n
          Gracias, un representante se estará comunicado con usted a la brevedad`;
      } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        return "Hubo un error al intentar guardar el mensaje";
      }
    }

    default:
      break;
  }
  return;
}

function validarEmail(email) {
  return isEmail(email);
}
async function guardarChat(messages) {
  const result = await messagesService.addMany(messages);
  return result;
}

async function SaveImages(data) {
  try {
    // Aquí puedes procesar y guardar las imágenes en el servidor

    const fileNames = await Promise.all(
      data.map(async (image, index) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

        const fileName = `${uniqueSuffix}.webp`;
        const directoryPath = path.join(__dirname, "/public/images/products/");
        const filePath = path.join(directoryPath, fileName);

        await mkdir(directoryPath, { recursive: true });
        const convertedImageBuffer = await sharp(image)
          .toFormat("webp")
          .toBuffer();

        await writeFile(filePath, convertedImageBuffer);
        return fileName;
      })
    );
    fileNames.forEach((fileName) => {});
    // Devolver nombres de archivo al cliente
    return fileNames;
  } catch (error) {
    logger.error("❌ ~ SaveImages ~ error:",
      "Error al procesar imágenes:",
      error
    );
  }
}

export default IOinit;
