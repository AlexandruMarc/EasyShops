import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ShoppingCartContext } from '../../context/Contex';
import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';
import CartTile from './CartTile';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const { cartId, setCartItems, cartItems } = useContext(ShoppingCartContext);
  const navigate = useNavigate();
  const createNotification = useCreateNotification();
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  async function getCart() {
    try {
      const { data } = await apiClient.get(`/cart/${cartId}/my-cart`);
      setCart(data.data);
      setCartItems(data.data.items);
      updateTotalPrice(data.data.items);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  useEffect(() => {
    if (cart) {
      updateTotalPrice(cart.items);
    } else {
      getCart();
    }
  }, [cart, cartId]);

  async function handleClearCart() {
    try {
      const { data } = await apiClient.delete(`/cart/${cartId}/clear-cart`);
      setCart(null);
      setTotalPrice(0);
      createNotification({ message: data.message, type: 'success' });
    } catch (error) {
      createNotification({ message: 'Error clearing cart', type: 'error' });
    }
  }

  async function handleRemoveItem(productId) {
    try {
      await apiClient.delete(`/cart-items/${cartId}/item/${productId}/remove`);

      const updatedItems = cart.items.filter(
        (item) => item.product.id !== productId,
      );
      setCart((prevCart) => ({
        ...prevCart,
        items: updatedItems,
      }));

      setCartItems(updatedItems);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  async function handleUpdateQuantity(productId, quantity) {
    await apiClient.put(
      `/cart-items/${cartId}/item/${productId}/update`,
      null,
      {
        params: { quantity },
      },
    );
    const updatedItems = cart.items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );
    setCart((prevCart) => {
      return {
        ...prevCart,
        items: updatedItems,
      };
    });
    setCartItems(updatedItems);
  }

  function updateTotalPrice(items) {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );
    setTotalPrice(totalAmount);
  }

  return (
    <div className="p-20 max-w-5x1 mx-auto max-md:max-w-xl py-4">
      <h1 className="text-[29px] font-bold text-gray-800 text-center font-serif mt-2">
        My Cart
      </h1>
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="md:col-span-2 space-y-4 shadow-2xl border-2 border-b-4 border-gray-300 p-4">
          {cart ? (
            cart.items.length > 0 ? (
              cart?.items.map((item) => (
                <CartTile
                  key={item.itemId}
                  item={item}
                  handleRemoveItem={handleRemoveItem}
                  handleUpdateQuantity={handleUpdateQuantity}
                />
              ))
            ) : (
              <div className="p-20 max-w-5x1 text-center font-serif text-3xl">
                No Items in cart...
              </div>
            )
          ) : (
            <div className="p-20 max-w-5x1 text-center font-serif text-3xl">
              No Cart
            </div>
          )}
        </div>
        <div className=" bg-white border-gray-200 shadow-2xl border-2 border-b-4 rounded-md p-4 mb-4 h-[250px] w-[400px]">
          <h3 className="text-xl font-bold text-gray-900 border-b  border-gray-300 pb-2">
            Order Summary
          </h3>
          <ul className="text-gray-700 mt-4 space-y-2">
            <p className="flex flex-wrap gap-4 text-sm font-bold">
              Total items: {totalItems || 0}
            </p>
            <p className="flex flex-wrap gap-4 text-sm font-bold">
              Total price: ${totalPrice.toFixed(2)}
            </p>
          </ul>
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => navigate(`/cart/checkout`)}
              className="text-sm px-4 py-3 shadow-lg border-2 border-b-4 border-black bg-gray-100 text-black hover:bg-gray-800 hover:text-white rounded-[12px] cursor-pointer active:shadow-sm active:border-b-2 active:translate-y-1"
            >
              Checkout
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-sm px-4 py-3 shadow-lg border-2 border-b-4 border-black bg-gray-100 text-black hover:bg-gray-800 hover:text-white rounded-[12px] cursor-pointer active:shadow-sm active:border-b-2 active:translate-y-1"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleClearCart}
              className="text-sm px-4 py-3  shadow-lg border-2 border-b-4 border-red-800 bg-gray-100 text-red-600  hover:bg-red-500 hover:text-white rounded-[12px] active:shadow-sm active:border-b-2 active:translate-y-1 cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
