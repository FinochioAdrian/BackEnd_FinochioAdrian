import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = "products";

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [String],
  },
  owner: {
    type:
    {
      _id:
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      admin:
      {
        type: Boolean,
        default: false
      }

    }

  }

});

productSchema.plugin(mongoosePaginate);

export default mongoose.model(productCollection, productSchema);
