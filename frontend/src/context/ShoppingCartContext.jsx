import { createContext, useEffect, useState } from 'react';

import apiClient from '../services/apiClient';
import { useCreateNotification } from '../utils/toast';

export const ShoppingCartContext = createContext(null);

export default function ShoppingCartProvider({ children }) {
  const [cartId, setCartId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const createNotification = useCreateNotification();

  async function getUserCart() {
    try {
      const { data } = await apiClient.get(`cart/${cartId}/my-cart`);
      setCartItems(data.data.items);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  useEffect(() => {
    if (cartId) {
      getUserCart();
    }
  }, [cartId]);

  async function refreshProducts() {
    await getAllProducts();
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        userId,
        setUserId,
        cartId,
        setCartId,
        searchResults,
        setSearchResults,
        refreshProducts,
        cartItems,
        setCartItems,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
