import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "user", "premium"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    default: null,
  },
  documents: {
    type: [{
      name: {
        type: String,
        required: true,
        trim: true,
      },
      reference: {
        type: String,
        required: true,
      },
    }],
  },
  last_connection: {
    type: {
      name: {
        type: String,
        enum: ["login", "logout"],
      },
      date: {
        type: Date,
      }
    },
  }

});

export default mongoose.model("Users", UsersSchema);
