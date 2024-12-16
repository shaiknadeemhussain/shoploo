import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        productId: { type: String, required: true },  // Reference to the product ID
        quantity: { type: Number, required: true, default: 1 },
        size: { type: String, required: true },
        color: { type: String, required: false },  // Optional color field
        design: { type: String, required: false },  // URL or file reference for custom design
        designSize: { type: String, required: false },  // Size of the design (if applicable)
        position: { type: String, required: false },  // Position of the design on the product
        price: { type: Number, required: true },  // Product price with any customization added
    }],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true }
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
