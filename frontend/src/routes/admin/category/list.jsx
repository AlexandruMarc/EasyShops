import React, { useEffect, useState } from 'react';

import Loader from '../../../components/utils/Loader';
import apiClient from '../../../services/apiClient';
import { useCreateNotification } from '../../../utils/toast';
import CreateAndUpdateCategory from './create-update';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const createNotification = useCreateNotification();

  async function getCategoriesList() {
    try {
      const { data } = await apiClient.get('/categories/all');
      setCategories(data.data);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategoriesList();
  }, []);

  async function deleteCategory(id) {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await apiClient.delete(`/categories/category/${id}/delete`);
        createNotification({
          message: 'Category deleted successfully',
          type: 'success',
        });
        getCategoriesList();
      } catch (error) {
        createNotification({ message: error, type: 'error' });
      }
    }
  }

  function handleEdit(categoryId) {
    setSelectedCategoryId(categoryId);
    setIsEditing(true);
  }

  function handleCreate() {
    setSelectedCategoryId(null);
    setIsEditing(true);
  }

  function handleClose() {
    setIsEditing(false);
    setSelectedCategoryId(null);
  }

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto mt-15">
      <h1 className="text-2xl font-bold mb-4">Category List Actions</h1>
      <button
        onClick={handleCreate}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
          py-2 px-4 rounded mb-3 inline-block cursor-pointer"
      >
        Create Category
      </button>
      <table className="min-w-full bg-white border border-gray-600">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{category.id}</td>
                <td className="py-2 px-4 border-b">{category.name}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(category.id)}
                    className="bg-yellow-500 hover:bg-yellow-700 
                      text-white font-bold py-1 px-3 cursor-pointer rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="bg-red-500 hover:bg-red-800 text-white 
                      font-bold py-1 px-3 cursor-pointer rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-2 px-4 text-center">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isEditing && (
        <CreateAndUpdateCategory
          categoryId={selectedCategoryId}
          onClose={handleClose}
          refreshCategories={getCategoriesList}
        />
      )}
    </div>
  );
}
