import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      // Generar código único automáticamente
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    },
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

export default mongoose.model(ticketsCollection, ticketsSchema);
