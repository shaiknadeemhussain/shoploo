import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    date: { type: Number, required: true }
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel

// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: Array, required: true },
//     category: { type: String, required: true },
//     subCategory: { type: String, required: true },
//     sizes: { type: Array, required: true },  // Sizes for the product
//     customizable: { type: Boolean, default: false },  // To check if this product is customizable
//     designOptions: { type: Array, default: [] },  // Optional designs available (if applicable)
//     colorOptions: { type: Array, default: [] },  // Color options available (if applicable)
//     bestseller: { type: Boolean },
//     date: { type: Number, required: true }
// });

// const productModel = mongoose.models.product || mongoose.model("product", productSchema);

// export default productModel;
