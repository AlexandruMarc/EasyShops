import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ShoppingCartContext } from '../../context/Contex';
import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';

const URL = 'http://localhost:8080';

export default function ProductCard({ product }) {
  const { cartId, setCartItems } = useContext(ShoppingCartContext);
  const createNotification = useCreateNotification();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [outOfStock, setOutOfStock] = useState(false);

  async function getCartItem(cartId, productId) {
    try {
      const { data } = await apiClient.get(
        `/cart-items/${cartId}/item/${productId}`,
      );
      if (data.message === 'Not Found !') {
        return;
      }
      if (product.inventory < data.data.quantity + 1) {
        setOutOfStock(true);
      }
    } catch (error) {
      //ignore
    }
  }

  useEffect(() => {
    if (product && cartId) {
      getCartItem(cartId, product.id);
    }

    if (product.inventory < 1) {
      setOutOfStock(true);
    }
  }, [product, cartId]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      createNotification({
        message: 'Please login to add items to the cart',
        type: 'warning',
      });
      return;
    }
    try {
      const { data } = await apiClient.post('/cart-items/item/add', null, {
        params: { cartId, productId: product.id, quantity: 1 },
      });
      setCartItems(data.data.items);
      getCartItem(cartId, product.id);
    } catch (error) {
      createNotification({
        message: error,
        type: 'error',
      });
    }
  }

  return (
    <div className="relative group shadow-lg border border-gray-300 rounded-lg overflow-hidden">
      <Link
        to={`/product-details/${product.id}`}
        className="relative group shadow-lg border border-gray-300 rounded-lg overflow-hidden block hover:shadow-xl transition-shadow"
      >
        <div className="relative w-full h-64 bg-gray-100">
          <img
            src={URL + product.images[0]?.downloadURL}
            alt={product.images[0]?.imageName}
            className="absolute p-2 inset-0 ml-3 w-[93%] h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 truncate">{product.brand}</p>
          <p className="text-xl font-bold text-gray-900 mt-2">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors ${
          outOfStock
            ? 'bg-gray-500 text-white cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-800 cursor-pointer'
        }`}
        disabled={outOfStock}
      >
        <FontAwesomeIcon icon={faCartPlus} />
      </button>
    </div>
  );
}
