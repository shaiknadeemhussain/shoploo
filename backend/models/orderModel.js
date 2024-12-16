// models/orderModel.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
  phone: String
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  address: { type: addressSchema, required: true },  // Use addressSchema here
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;  // Exporting the model correctly


// const Order = mongoose.model('Order', orderSchema);

// export default Order;  // Make sure to export the model as default
// const orderSchema = new mongoose.Schema({
//     userId: String,
//     items: [{
//         productId: String,
//         name: String,
//         price: Number,
//         quantity: Number,
//         customizationDetails: String, // To store customization info if any
//     }],
//     address: String,
//     amount: Number,
//     paymentMethod: String,
//     payment: Boolean,
//     date: Date,
// });
