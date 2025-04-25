import { faTruckFast, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';
import CreateAddressModal from './CreateAddressModal';

export default function BillingData({
  userId,
  selectedAddress,
  setSelectedAddress,
}) {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [billingType, setBillingType] = useState('individual');
  const createNotification = useCreateNotification();

  async function fetchAddresses() {
    try {
      const { data } = await apiClient.get(`/address/user/${userId}`);
      setAddresses(data.data);
    } catch (error) {
      createNotification({
        message: 'Failed to fetch addresses',
        type: 'error',
      });
    }
  }

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  function handleAddressChange(addressId) {
    const selected = addresses.find(
      (addr) => addr.addressId === parseInt(addressId),
    );
    setSelectedAddress(selected);
  }

  function handleSave() {
    if (!selectedAddress) {
      createNotification({
        message: 'Please select an address',
        type: 'warning',
      });
      return;
    }
    setIsModalOpen(false);
    createNotification({ message: 'Address updated!', type: 'success' });
  }

  return (
    <div className="p-4 bg-white text-gray-800 rounded-md shadow-2xl border-2 border-b-4 border-gray-200 ">
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 font-bold rounded-full">
          2
        </div>
        <h2 className="text-lg font-semibold">Billing details</h2>
      </div>

      {/* Billing Type Options */}
      <div className="mt-4 text-[18px]">
        <h3 className="font-semibold mb-2">Billing Type</h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="billingType"
              value="individual"
              checked={billingType === 'individual'}
              onChange={(e) => setBillingType(e.target.value)}
              className="cursor-pointer"
            />
            <span className="text-gray-700">Individual</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="billingType"
              value="company"
              checked={billingType === 'company'}
              onChange={(e) => setBillingType(e.target.value)}
              className="cursor-pointer"
            />
            <span className="text-gray-700">Company</span>
          </label>
        </div>
      </div>

      <div className="mt-4 border border-gray-200 rounded-md">
        <div className="flex items-center p-4 space-x-2 border-b border-gray-200">
          <p className="text-[15px] text-gray-700">
            <FontAwesomeIcon icon={faTruckFast} /> I have retrieved the billing
            details from the last order
          </p>
        </div>

        <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <p className="font-semibold text-gray-800">
              {billingType === 'individual' ? 'Individual' : 'Company'}
            </p>
            {selectedAddress ? (
              <p className="text-sm text-gray-600">
                str {selectedAddress.street} in {selectedAddress.city} with
                postal code {selectedAddress.zipCode}, {selectedAddress.country}
              </p>
            ) : (
              <p className="text-sm text-gray-600">No address selected</p>
            )}
          </div>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Modify
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Choose billing address
            </h2>

            <div className="space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr.addressId}
                  className="border border-gray-200 rounded-md p-3 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <p className="text-[15px] text-gray-600">
                      str {addr.street} in {addr.city} with postal code{' '}
                      {addr.zipCode}, {addr.country}
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={addr.addressId}
                    checked={selectedAddress?.addressId === addr.addressId}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className="ml-4"
                  />
                </label>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsCreating(true)}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        + Add new address
      </button>
      {isCreating && (
        <CreateAddressModal
          userId={userId}
          setIsCreating={setIsCreating}
          onAddressCreated={fetchAddresses}
        />
      )}
    </div>
  );
}
