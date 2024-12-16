import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();
export const useShopContext = () => {
    return useContext(ShopContext);
};

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [customizationOptions, setCustomizationOptions] = useState({
        design: null, color: null, size: null
    });
    const navigate = useNavigate();

    // Updated addToCart function to handle both types of requests
    const addToCart = async (itemId, size, customOptions = null, color = null) => {
        console.log('addToCart called with:');
        console.log('Product ID:', itemId);
        console.log('Selected Size:', size);
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);
        console.log("cart clone :"+cartData)

        // Create a key to uniquely identify items, including custom options if present
        let itemKey = itemId;
        if (customOptions) {
            itemKey += `-${customOptions.file.name}-${color}`;
        }

        // Add or update the cart item based on the key
        if (cartData[itemKey]) {
            if (cartData[itemKey][size]) {
                cartData[itemKey][size] += 1;
            } else {
                cartData[itemKey][size] = 1;
            }
        } else {
            cartData[itemKey] = { [size]: 1 };
        }

        // Set the updated cart data
        setCartItems(cartData);

        // Prepare the data to send to the backend
        const payload = {
            itemId,
            size,
            design: customOptions?.file || null,
            position: customOptions?.position || null,
            designSize: customOptions?.size || null,
            color: color || null
        };

        // Send the data to the backend if the token is available
        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/add`, payload, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    // Get total cart item count
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalCount += cartItems[items][item];
                }
            }
        }
        return totalCount;
    };

    // Update quantity of an item in the cart
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    // Get total cart amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            // Safely find the product by ID, and default to an empty object if not found
            let itemInfo = products.find((product) => product._id === items.split('-')[0]) || {};
            
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    // If price is undefined or product not found, default to 0
                    const price = itemInfo.price ?? 0;
                    totalAmount += price * cartItems[items][item];
                }
            }
        }
        return totalAmount;
    };
    

    // Fetch product data
    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Fetch user's cart data
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Update customization options (for design, color, etc.)
    const updateCustomization = (option, value) => {
        setCustomizationOptions(prev => ({ ...prev, [option]: value }));
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
        if (token) {
            getUserCart(token);
        }
    }, [token]);

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token,
        customizationOptions, updateCustomization
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
