import mongoose, { Schema } from "mongoose";

const messagesCollection = "messages"

const messagesSchema = mongoose.Schema({
  user: {
    type: String,
    validate: {
      validator: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: (value) => `${value} no es un formato de correo electrónico válido.`,
    },
    required: true,
  },
  message:{ 
      type: String,
      required: true,}
    
});
  
  export default mongoose.model(messagesCollection, messagesSchema);
  