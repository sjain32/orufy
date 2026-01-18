import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },

    Product_Type: {
      type: String,
      enum: [
        "Electronics",
        "Clothing",
        "Books",
        "Home Appliances",
        "Toys",
        "Sports Equipment",
        "Beauty Products",
        "Groceries",
        "Furniture",
        "Jewelry",
      ],
      required: true,
    },

    Quantiy: { type: Number, required: true, min: 0 },
    MRP: { type: Number, required: true, min: 0 },
    Selling_Price: { type: Number, required: true, min: 0 },

    Brand_Name: { type: String, required: true },
    Image_URLs: [String],
    Exchange_Available: { type: Boolean, default: false },
    published: { type: Boolean, default: false },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
