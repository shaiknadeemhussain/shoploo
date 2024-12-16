import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Draggable from 'react-draggable';
import frontView from '../assets/p_img2_1.png';
import backView from '../assets/p_img2_2.png';
import sideView from '../assets/p_img2_3.png';
import { useShopContext } from '../context/ShopContext';

const Customise = () => {
  const { productId } = useParams();
  const { addToCart } = useShopContext();

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [customDesign, setCustomDesign] = useState(null);
  const [designSize, setDesignSize] = useState({ width: 100, height: 100 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  const mockProduct = {
    _id: productId || '675fb25a1ef194bb87ee429a',
    name: 'Custom T-Shirt',
    description: 'A customizable t-shirt with your own design.',
    price: 19.99,
    sizes: ['S', 'M', 'L', 'XL'],
    image: [frontView, backView, sideView],
    category: 'Clothing',
    colors: ['Red', 'Blue', 'Green', 'Black', 'White'],
  };

  useEffect(() => {
    setProductData(mockProduct);
    setImage(mockProduct.image[0]);
  }, []);

  // Handle custom design upload
  const handleCustomDesignChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCustomDesign(file);
      console.log('Custom design uploaded:', file);

    } else {
      alert('Please upload a valid image file.');
    }
  };

  // Update the position when dragging stops
  const handleDragStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  // Add product to cart with customizations
  const handleAddToCart = () => {
    if (!size) {
      alert('Please select a size.');
      return;
    }

    if (!customDesign) {
      alert('Please upload a custom design.');
      return;
    }

    // Create an object to hold custom design details
    const customizations = {
      file: customDesign,
      position,
      size: designSize,
    };

    console.log('Adding to cart with the following data:');
    console.log('Product ID:', productData._id);
    console.log('Selected Size:', size);
    console.log('Custom Design File:', customDesign);
    console.log('Color:', color);
    console.log('Customizations:', customizations);
    // Call addToCart with productId, size, customizations, and color
    addToCart(productData._id, size, customizations, color);
  };

  return productData ? (
    <div className="border-t-2 pt-10">
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* Thumbnails and Main Image */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%]">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                onClick={() => setImage(item)}
                className="w-[80px] h-[80px] object-cover cursor-pointer"
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>
          <div className="relative w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="Selected View" />
            {customDesign && (
              <Draggable onStop={handleDragStop}>
                <div
                  className="absolute cursor-move"
                  style={{ width: `${designSize.width}px`, height: `${designSize.height}px` }}
                >
                  <img
                    src={URL.createObjectURL(customDesign)}
                    alt="Custom Design"
                    className="object-contain w-full h-full"
                  />
                </div>
              </Draggable>
            )}
          </div>
        </div>

        {/* Customisation Options */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <p className="mt-5 text-3xl font-medium">${productData.price}</p>

          <div className="my-8">
            <p>Upload Your Custom Design</p>
            <input type="file" accept="image/*" onChange={handleCustomDesignChange} />
          </div>

          <div className="my-8">
            <p>Select Size</p>
            {productData.sizes.map((item) => (
              <button
                key={item}
                onClick={() => setSize(item)}
                className={`border py-2 px-4 ${item === size ? 'border-orange-500' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="my-8">
            <p>Select Color</p>
            {productData.colors.map((item) => (
              <button
                key={item}
                onClick={() => setColor(item)}
                className={`border py-2 px-4 ${item === color ? 'border-orange-500' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-orange-500 text-white py-2 px-6 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Customise;
