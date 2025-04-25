import { createContext, useEffect, useState } from 'react';

import apiClient from '../services/apiClient';
import { useCreateNotification } from '../utils/toast';

export const ShoppingCartContext = createContext(null);

export default function ShoppingCartProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [listOfProducts, setListOfProducts] = useState([]);
  const [productsDetails, setProductsDetails] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const createNotification = useCreateNotification();

  async function getAllProducts() {
    try {
      const { data } = await apiClient.get('/products/all');
      setListOfProducts(data.data || []);
      setSearchResults(0);
      setSelectedProduct(0);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function getUserCart() {
    try {
      const { data } = await apiClient.get(`cart/${cartId}/my-cart`);
      setCartItems(data.data.items);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (cartId) {
      getUserCart();
    }
    getAllProducts();
  }, [cartId]);

  async function refreshProducts() {
    setLoading(true);
    await getAllProducts();
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        userId,
        setUserId,
        cartId,
        setCartId,
        listOfProducts,
        loading,
        setLoading,
        productsDetails,
        setProductsDetails,
        searchResults,
        setSearchResults,
        selectedProduct,
        setSelectedProduct,
        refreshProducts,
        cartItems,
        setCartItems,
        sortOption,
        setSortOption,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
