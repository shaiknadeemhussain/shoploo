// Assuming you have the getUserCart and updateCart functions defined in the controller

// Add products to the user's cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, customDesign = null, color = null } = req.body;

        // Fetch user data and cart data
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        // Get product price from database
        const product = await productModel.findById(itemId); // Assuming a product model exists with price

        // Ensure the product exists
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const price = product.price;  // Store product price

        // Ensure the cartData object has a structure for the itemId
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        // Initialize the size array if not already present
        if (!cartData[itemId][size]) {
            cartData[itemId][size] = [];
        }

        // Handle customized products
        if (customDesign || color) {
            // Add custom product entry with design and color
            cartData[itemId][size].push({
                customDesign,
                color,
                quantity: 1,
                price  // Add the price here
            });
        } else {
            // Handle regular product: check if it exists, increment the quantity if so
            const existingIndex = cartData[itemId][size].findIndex(
                item => !item.customDesign && !item.color
            );

            if (existingIndex !== -1) {
                cartData[itemId][size][existingIndex].quantity += 1;
            } else {
                // Add new regular product entry
                cartData[itemId][size].push({
                    customDesign: null,
                    color: null,
                    quantity: 1,
                    price  // Add the price here
                });
            }
        }

        // Update the user's cart data
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Example of getUserCart function
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cart: user.cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Example of updateCart function
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};
        if (cartData[itemId] && cartData[itemId][size]) {
            const product = cartData[itemId][size].find(item => !item.customDesign && !item.color);
            if (product) {
                product.quantity = quantity;
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Export the functions
export { addToCart, getUserCart, updateCart };
