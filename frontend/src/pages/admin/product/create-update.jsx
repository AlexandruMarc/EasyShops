import { faSquareCaretDown, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ShoppingCartContext } from '../../../context/Contex';
import apiClient from '../../../services/apiClient';
import { useCreateNotification } from '../../../utils/toast';

const URL = 'http://localhost:8080';

export default function CreateAndUpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const createNotification = useCreateNotification();
  const { refreshProducts } = useContext(ShoppingCartContext);
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    price: '',
    inventory: '',
    description: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [image, setImage] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    getCategories();
    if (id) {
      setIsUpdate(true);
      getProductDetails();
    }
  }, [id]);

  async function getCategories() {
    try {
      const { data } = await apiClient.get('/categories/all');
      setCategories(data.data);
    } catch (error) {
      createNotification({
        message: error,
        type: 'error',
      });
    }
  }

  async function getProductDetails() {
    try {
      const { data } = await apiClient.get(`/products/product/${id}/product`);
      setProduct({
        name: data.data.name,
        brand: data.data.brand,
        price: data.data.price,
        inventory: data.data.inventory,
        description: data.data.description,
        category: data.data.category.name,
      });
      setImages(data.data.images);
    } catch (error) {
      // ignore
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  }

  function handleImageChange(e) {
    setImage([...e.target.files]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isUpdate) {
        const { data } = await apiClient.put(
          `/products/product/${id}/update`,
          product,
        );
        await handleImageUpload(data.data.id);
        createNotification({
          message: 'Product updated!',
          type: 'success',
        });
      } else {
        const { data } = await apiClient.post('/products/add', product);
        await handleImageUpload(data.data.id);
        createNotification({
          message: 'Product created!',
          type: 'success',
        });
        await refreshProducts();
        setIsUpdate(true);
        navigate(`/admin/products/update/${data.data.id}`);
      }
      await refreshProducts();
    } catch (error) {
      createNotification({ message: 'Failed to save product', type: 'error' });
    }
  }

  async function handleImageUpload(productId) {
    if (image.length > 0) {
      const formData = new FormData();
      image.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('productId', productId);
      try {
        await apiClient.post('/images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        getProductDetails();
        setImage([]);
      } catch (error) {
        createNotification({
          message: 'Failed to upload image',
          type: 'error',
        });
      }
    }
  }

  async function handleImageDelete(imageId) {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await apiClient.delete(`/images/image/${imageId}/delete`);
        setTimeout(() => {
          createNotification({
            message: 'Image deleted!',
            type: 'success',
          });
        }, 3000);
        getProductDetails();
      } catch (error) {
        createNotification({
          message: 'Failed to delete image',
          type: 'error',
        });
      }
    }
  }

  return (
    <div className="container mx-auto mt-15 shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isUpdate ? 'Update Product' : 'Create Product'}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="col-span-1">
          <label className="block text-gray-700 text-md font-bold mb-3">
            <FontAwesomeIcon icon={faUpload} /> Upload Image
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="file:mr-4 file:rounded-full file:border-0 file:bg-white
             file:px-4 file:cursor-pointer file:py-2 file:text-sm 
             file:font-semibold file:text-white hover:file:bg-violet-100
           dark:file:bg-gray-700 dark:file:text-white 
           dark:hover:file:bg-gray-900 ..."
          />
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Existing Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {images.length > 0 ? (
                images.map((img) => (
                  <div
                    key={img.imageId}
                    className="relative group border border-cyan-700 p-6"
                  >
                    <div className="overflow-hidden aspect-w-1 aspect-h-1">
                      <img
                        className="object-cover aspect-square transition-all
                        duration-300 group-hover:scale-125"
                        src={URL + img.downloadURL}
                        alt={img.imageName}
                      />
                    </div>
                    <button
                      onClick={() => handleImageDelete(img.imageId)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-800 text-white text-[9px] 
                      rounded-full p-2 shadow-lg cursor-pointer"
                    >
                      &#10005;
                    </button>
                  </div>
                ))
              ) : (
                <div>No images </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3
                 text-gray-700 leading-tight "
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3
                 text-gray-700 leading-tight "
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3
               text-gray-700 leading-tight "
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Inventory
            </label>
            <input
              type="number"
              name="inventory"
              value={product.inventory}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3
                 text-gray-700 leading-tight "
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              maxLength={255}
              value={product.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3
                 text-gray-700 leading-tight "
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 
                  px-3 pr-8 text-gray-700 leading-tight"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 
                flex items-center px-2 text-gray-700"
              >
                <FontAwesomeIcon icon={faSquareCaretDown} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white 
                font-bold py-2 px-4 rounded  cursor-pointer"
            >
              {isUpdate ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products/list')}
              className="bg-gray-500 hover:bg-gray-700 text-white 
                font-bold py-2 px-4 rounded cursor-pointer"
            >
              Back to list
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
