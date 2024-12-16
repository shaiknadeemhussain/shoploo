import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    if (products.length > 0) {
      const tempData = [];
      // Loop over cartItems to extract the data
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          const cartItem = cartItems[items][item];

          if (cartItem > 0) {
            // Check if the cart item is customized
            const customItem = cartItem.customDesign !== null;

            // Prepare the data
            const cartItemData = {
              _id: items,
              size: item,
              quantity: cartItem.quantity,
              customDesign: customItem ? cartItem.customDesign : null,
              color: cartItem.color || null,
            };

            tempData.push(cartItemData);
          }
        }
      }

      console.log('Updated Cart Data:', cartData);
      setCartData(tempData);
    }
  }, [cartItems, products])

  return (
    <div className='border-t pt-14'>

      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {
          cartData.map((item, index) => {

            const productData = products.find((product) => product._id === item._id);
           
            const defaultImage = assets.default_image || 'shoploo/frontend/src/assets/p_img2_1.png';
            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData?.image[0] || defaultImage} alt={productData?.name || 'Product'} />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData?.name || 'Unkonwn product'}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData?.price || 'N/A'}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                    </div>

                    {/* If it's a custom product, show the custom details */}
                    {item.customDesign && (
                      <div className='mt-2'>
                        <p className="text-sm text-gray-600">Custom Design: <span className="font-medium">{item.customDesign.file}</span></p>
                        <p className="text-sm text-gray-600">Position: x: {item.customDesign.position.x}, y: {item.customDesign.position.y}</p>
                        <p className="text-sm text-gray-600">Size: width: {item.customDesign.size.width}, height: {item.customDesign.size.height}</p>
                        {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Input for Quantity */}
                <input
                  onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                  className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />

                {/* Remove Item */}
                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className='w-4 mr-4 sm:w-5 cursor-pointer'
                  src={assets.bin_icon}
                  alt="Remove item"
                />
              </div>
            );
          })
        }
      </div>

      {/* Checkout Section */}
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button
              onClick={() => navigate('/place-order')}
              className='bg-black text-white text-sm my-8 px-8 py-3'>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Cart;
