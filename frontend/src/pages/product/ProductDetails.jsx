import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { ShoppingCartContext } from '../../context/Contex';
import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';

const URL = 'http://localhost:8080';

function ProductDetails() {
  const { id } = useParams();
  const { cartId } = useContext(ShoppingCartContext);
  const [productsDetails, setProductsDetails] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [outOfStock, setOutOfStock] = useState(false);
  const thumbnailsRef = useRef(null);
  const navigate = useNavigate();
  const createNotification = useCreateNotification();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const images = productsDetails.images || [];

  let swap = selectedIndex;
  function scrollThumbnails(direction) {
    if (
      (swap === 0 && direction === 'left') ||
      (swap === images.length - 1 && direction === 'right')
    )
      return;
    if (
      (direction === 'right' && swap >= 0) ||
      (direction === 'left' && swap <= images.length)
    ) {
      thumbnailsRef.current.scrollBy({
        left:
          direction === 'left'
            ? setSelectedIndex(--swap)
            : setSelectedIndex(++swap),
        behavior: 'smooth',
      });
    }
  }

  async function getCartItem(cartId, productId) {
    try {
      const { data } = await apiClient.get(
        `/cart-items/${cartId}/item/${productId}`,
      );
      if (data.message === 'Not Found !') {
        return;
      }
      if (productsDetails.inventory < data.data.quantity + quantity) {
        setOutOfStock(true);
      }
    } catch (error) {
      //ignore
    }
  }

  async function getProductDetails() {
    try {
      const { data } = await apiClient.get(`/products/product/${id}/product`);
      setProductsDetails(data.data || {});
      if (cartId) {
        await getCartItem(cartId, id);
      }
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  async function handleAddToCart() {
    if (!isAuthenticated) {
      createNotification({
        message: 'Please login to add items to your cart',
        type: 'warning',
      });
      navigate('/login');
      return;
    }
    try {
      await apiClient.post('/cart-items/item/add', null, {
        params: { cartId, productId: id, quantity },
      });
      navigate('/cart/my');
    } catch (error) {
      if (error.response.data.message) setOutOfStock(true);
      createNotification({
        message: error.response.data.message,
        type: 'error',
      });
    }
  }

  useEffect(() => {
    if (id) {
      getProductDetails();
    }
    if (productsDetails.inventory < 1) {
      setOutOfStock(true);
    }
  }, [id, productsDetails]);

  return (
    <div>
      <div className="p-6 lg:max-w-7xl max-w-4xl mx-auto mt-10 shadow-2xl border-2 border-b-4 border-gray-200 rounded-lg ">
        <h2 className="text-2xl font-semibold text-gray-900">
          {productsDetails?.name}
        </h2>
        <div className="grid items-center grid-cols-1 lg:grid-cols-5 gap-12 p-6 ">
          <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">
            <div className="w-4/5 mx-auto relative aspect-video flex justify-center items-center">
              {images.length > 0 && (
                <img
                  className="flex inset-0 h-full rounded object-cover transition-transform duration-300 hover:scale-105"
                  src={URL + images[selectedIndex].downloadURL}
                  alt={images[selectedIndex].imageName}
                />
              )}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-6 mx-auto">
              {images.length > 2 && (
                <>
                  <button
                    onClick={() => scrollThumbnails('left')}
                    className="absolute left-0 top-1/2 transform 
                    -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-gray-200"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={() => scrollThumbnails('right')}
                    className="absolute right-0 top-1/2 transform 
                    -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-gray-200"
                  >
                    &#8594;
                  </button>
                </>
              )}
              <div className="rounded-xl p-4 shadow-md">
                <div ref={thumbnailsRef} className="overflow-x-auto flex gap-6">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      className={`w-24 cursor-pointer rounded border-2 
                        border-transparent transition duration-300 hover:opacity-75 ${
                          selectedIndex === index ? 'border-blue-500' : ''
                        }`}
                      src={URL + image.downloadURL}
                      alt={image.imageName}
                      onMouseEnter={() => setSelectedIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-4 mt-4">
              <p className="text-2xl font-bold text-indigo-600">
                $ {productsDetails?.price}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <p className="text-[15px] font-light text-gray-700">
                Number of products available: {productsDetails?.inventory}
              </p>
            </div>
            <div className="mt-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
            <div className="mt-4">
              {outOfStock ? (
                <button
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md cursor-not-allowed"
                  disabled
                >
                  Out of stock
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="shadow-lg border-2 border-b-4 mt-5 border-gray-700 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 mb-7 p-6 lg:max-w-7xl max-w-4xl mx-auto shadow-2xl border-2 border-b-4 border-gray-200 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900">Description</h3>
          <p className="mt-4 text-gray-600 leading-relaxed">
            {productsDetails?.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
