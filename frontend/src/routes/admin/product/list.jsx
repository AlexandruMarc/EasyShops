import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Pagination from '../../../components/Pagination';
import DeleteConfirmationModal from '../../../components/products/DeleteConfirmationModal';
import ProductTable from '../../../components/products/ProductTable';
import Loader from '../../../components/utils/Loader';
import { ShoppingCartContext } from '../../../context/ShoppingCartContext.jsx';
import apiClient from '../../../services/apiClient';
import { useCreateNotification } from '../../../utils/toast';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const createNotification = useCreateNotification();
  const { refreshProducts } = useContext(ShoppingCartContext);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [usersFromResponse, setUsersFromResponse] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);

  async function getProductsList() {
    try {
      const { data } = await apiClient.get('/products/all');
      setProducts(data.data);
    } catch (error) {
      createNotification({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProductsList();
    getAllCategories();
  }, []);

  async function getAllCategories() {
    try {
      const { data } = await apiClient.get('/categories/all');
      setCategories(data.data || []);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  async function getProductsByCategory(category) {
    try {
      const { data } = await apiClient.get('/products/by-category', {
        params: { category },
      });
      setProducts(data.data);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  function handleCategoryChange(e) {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category === '') {
      getProductsList();
    } else {
      getProductsByCategory(category);
    }
  }

  async function deleteProduct(id) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await apiClient.delete(
          `/products/product/${id}/delete`,
        );
        if (response.data.message === 'Delete product success!') {
          setProducts(products.filter((product) => product.id !== id));
          await refreshProducts();
          createNotification({
            message: 'Product deleted successfully',
            type: 'success',
          });
        } else {
          setUsersFromResponse(response.data.data);
          setProductToDelete(id);
          setDeleteModalVisible(true);
        }
      } catch (error) {
        createNotification({ message: error, type: 'error' });
      }
    }
  }

  async function handleRemoveAndDelete() {
    try {
      for (const user of usersFromResponse) {
        await apiClient.delete(
          `/cart/items/${user.cart.cartId}/item/${productToDelete}/remove`,
        );
      }
      await apiClient.delete(`/products/product/${productToDelete}/delete`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productToDelete),
      );
      await refreshProducts();
      createNotification({
        message: 'Product deleted successfully after removing from carts',
        type: 'success',
      });
      setDeleteModalVisible(false);
    } catch (error) {
      console.log(error);

      createNotification({ message: error, type: 'error' });
    }
  }

  if (loading) return <Loader />;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Product Management
      </h1>
      <Link
        to="/admin/products/create"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition-colors mb-6 inline-block"
      >
        + Create New Product
      </Link>
      <div className="flex items-center mb-6">
        <label className="mr-4 font-semibold text-gray-700">
          Filter by Category:
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="block w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <ProductTable
          products={currentProducts}
          deleteProduct={deleteProduct}
        />
      </div>
      {deleteModalVisible && (
        <DeleteConfirmationModal
          users={usersFromResponse}
          onConfirm={handleRemoveAndDelete}
          onCancel={() => setDeleteModalVisible(false)}
        />
      )}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
