import React, { useEffect, useState } from 'react';

import apiClient from '../../services/apiClient';
import CreateAddressModal from '../address/CreateAddressModal';
import Loader from '../utils/Loader';

export default function AddressList({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function getAddresses() {
      if (userId === undefined || userId === null) return;
      try {
        const { data } = await apiClient.get(`/address/user/${userId}`);
        setAddresses(data.data);
      } catch (error) {
        setError('Failed to get addresses');
      } finally {
        setLoading(false);
      }
    }
    getAddresses();
  }, [userId]);

  function handleAddressCreated(newAddress) {
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
  }

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded shadow-2xl border-2 border-b-4 border-gray-200 w-full max-w-[50rem] mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Addresses</h2>
      <ul className="space-y-4">
        {addresses.length ? (
          addresses.map((address) => (
            <li
              key={address.addressId}
              className="bg-gray-50 hover:bg-gray-100 transition-all duration-200 ease-in-out p-4 rounded shadow-2xl border-2 border-b-4 border-gray-200"
            >
              <p className="text-gray-700">
                Str. {address.street}, {address.city} {address.county} cu cod
                postal {address.zipCode}, {address.country}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-700">No addresses found</p>
        )}
      </ul>
      <button
        className="mt-6 shadow-lg border-2 border-b-4 border-gray-800 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer active:shadow-sm active:border-b-2 active:translate-y-1"
        onClick={() => setIsAdding(true)}
      >
        + Add New Address
      </button>
      {isAdding && (
        <CreateAddressModal
          userId={userId}
          setIsCreating={setIsAdding}
          onAddressCreated={handleAddressCreated}
        />
      )}
    </div>
  );
}
