import React, { useEffect, useState } from 'react';

import apiClient from '../../../services/apiClient';
import { useCreateNotification } from '../../../utils/toast';

export default function CreateAndUpdateCategory({
  categoryId,
  onClose,
  refreshCategories,
}) {
  const createNotification = useCreateNotification();
  const [category, setCategory] = useState({
    name: '',
  });
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (categoryId) {
      setIsUpdate(true);
      getCategoryDetails();
    }
  }, [categoryId]);

  async function getCategoryDetails() {
    try {
      const { data } = await apiClient.get(
        `/categories/category/${categoryId}/ids`,
      );
      setCategory({
        name: data.data.name,
      });
    } catch (error) {
      createNotification({
        message: 'Failed to fetch category details',
        type: 'error',
      });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isUpdate) {
        await apiClient.put(
          `/categories/category/${categoryId}/update`,
          category,
        );
        createNotification({
          message: 'Category updated successfully',
          type: 'success',
        });
      } else {
        await apiClient.post('/categories/add', category);
        createNotification({
          message: 'Category created successfully',
          type: 'success',
        });
      }
      await refreshCategories();
      onClose();
    } catch (error) {
      createNotification({ message: 'Failed to save category', type: 'error' });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">
          {isUpdate ? 'Update Category' : 'Create Category'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={category.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 
              text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white 
                font-bold py-2 px-4 rounded focus:outline-none 
                focus:shadow-outline cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white 
                font-bold py-2 px-4 rounded focus:outline-none 
                focus:shadow-outline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
