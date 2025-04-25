import React, { useState } from 'react';

import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';

export default function CreateAddressModal({
  userId,
  setIsCreating,
  onAddressCreated,
}) {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    county: '',
    country: '',
    zipCode: '',
  });
  const createNotification = useCreateNotification();

  function handleChange(e) {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await apiClient.post(
        `/address/user/${userId}/create`,
        address,
      );
      createNotification({
        message: 'Address created successfully',
        type: 'success',
      });

      if (onAddressCreated) {
        onAddressCreated(data.data);
      }
      setIsCreating(false);
    } catch (error) {
      createNotification({ message: 'Error creating address', type: 'error' });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Address</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="street"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Street
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="city"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="county"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              County
            </label>
            <input
              type="text"
              id="county"
              name="county"
              value={address.county}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="country"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="zipCode"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={address.zipCode}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
