import { useContext, useEffect, useState } from 'react';

import { ShoppingCartContext } from '../context/Contex';
import apiClient from '../services/apiClient';
import { useCreateNotification } from '../utils/toast';

export default function SearchFilters({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
}) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const { setSearchResults } = useContext(ShoppingCartContext);
  const [sortOption, setSortOption] = useState('');
  const createNotification = useCreateNotification();

  useEffect(() => {
    async function getAllCategories() {
      try {
        const { data } = await apiClient.get('/categories/all');
        setCategories(data.data || []);
      } catch (error) {
        createNotification({ message: error, type: 'error' });
      }
    }

    async function getBrands() {
      try {
        const { data } = await apiClient.get('/products/brands');
        setBrands(data.data || []);
      } catch (error) {
        createNotification({ message: error, type: 'error' });
      }
    }

    getAllCategories();
    getBrands();
  }, []);

  async function getAllProducts() {
    try {
      const { data } = await apiClient.get('/products/all');
      setSearchResults(data.data);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  async function getProductsByCategory(category) {
    try {
      const { data } = await apiClient.get('/products/by-category', {
        params: { category },
      });
      setSearchResults(data.data);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  async function getProductsByBrand(brand) {
    try {
      const { data } = await apiClient.get('/products/by-brand', {
        params: { brand },
      });
      setSearchResults(data.data);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  async function getProductsByCategoryAndBrand(category, brand) {
    try {
      const { data } = await apiClient.get(
        '/products/products/by/category-and-brand',
        {
          params: { category, brand },
        },
      );
      if (data.data === null) {
        createNotification({
          message: data.message,
          type: 'info',
        });
        return;
      }
      setSearchResults(data.data);
    } catch (error) {
      createNotification({
        message: error.response.data.message,
        type: 'info',
      });
    }
  }

  async function getProductsInAscendingOrder() {
    try {
      const { data } = await apiClient.get('/products/sort/asc');
      setSearchResults(data.data);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  async function getProductsInDescendingOrder() {
    try {
      const { data } = await apiClient.get('/products/sort/desc');
      setSearchResults(data.data);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  function handleCategoryChange(e) {
    const category = e.target.value;
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? '' : category,
    );
  }

  function handleBrandChange(e) {
    const brand = e.target.value;
    setSelectedBrand((prevBrand) => (prevBrand === brand ? '' : brand));
  }

  async function handleFilterSearch() {
    if (selectedCategory && selectedBrand) {
      await getProductsByCategoryAndBrand(selectedCategory, selectedBrand);
    } else if (selectedBrand) {
      await getProductsByBrand(selectedBrand);
    } else if (selectedCategory) {
      await getProductsByCategory(selectedCategory);
    }
  }

  function handleSortChange(e) {
    const value = e.target.value;
    setSortOption(value);
    if (value === 'asc') {
      getProductsInAscendingOrder();
    } else if (value === 'desc') {
      getProductsInDescendingOrder();
    } else if (value === '') {
      getAllProducts();
    }
  }

  function resetFilters() {
    setSelectedCategory('');
    setSelectedBrand('');
    setSortOption('');
    getAllProducts();
  }

  return (
    <div className="p-6 border-r border-gray-300 ml-1 mr-12 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Filters</h3>
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-700">Categories</h4>
        {categories.length ? (
          categories.map((category) => (
            <div key={category.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                value={category.name}
                checked={selectedCategory === category.name}
                onChange={handleCategoryChange}
                className="mr-2 accent-blue-600 cursor-pointer"
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No categories available</p>
        )}
      </div>
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-700">Brands</h4>
        {brands.length ? (
          brands.map((brand, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`brand-${index}`}
                value={brand}
                checked={selectedBrand === brand}
                onChange={handleBrandChange}
                className="mr-2 accent-blue-600 cursor-pointer"
              />
              <label
                htmlFor={`brand-${index}`}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No brands available</p>
        )}
      </div>
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-700">Sort By</h4>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Sorting Option</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
      <button
        onClick={handleFilterSearch}
        className="bg-gray-600 text-white py-2 px-4 rounded-md shadow hover:bg-gray-700 transition-colors w-full"
      >
        Apply Filters
      </button>
      <button
        onClick={resetFilters}
        className="mt-2 bg-gray-600 text-white py-2 px-4 rounded-md shadow hover:bg-gray-700 transition-colors w-full"
      >
        Reset Filters
      </button>
    </div>
  );
}
