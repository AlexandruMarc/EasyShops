import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Loader from '../../../components/utils/Loader';
import apiClient from '../../../services/apiClient';
import { useCreateNotification } from '../../../utils/toast';

const OrderStatus = [
  'PENDING',
  'COMPLETED',
  'CANCELLED',
  'DELIVERED',
  'RETURNED',
];

export default function UpdateOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const createNotification = useCreateNotification();
  const navigate = useNavigate();

  async function getOrder() {
    try {
      const { data } = await apiClient.get(`/orders/${id}/order`);
      setOrder(data.data);
      setStatus(data.data.status);
    } catch (error) {
      createNotification({
        message: error,
        type: 'error',
      });
    }
  }

  useEffect(() => {
    getOrder();
  }, [id]);

  async function handleUpdateOrder() {
    try {
      const updatePayload = {
        id: order.id,
        totalAmount: order.totalAmount,
        status: status,
      };

      const { data } = await apiClient.put(
        `/orders/${id}/update`,
        updatePayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      createNotification({ message: data.message, type: 'success' });
      navigate('/admin/orders/list');
    } catch (error) {
      createNotification({
        message: error,
        type: 'error',
      });
    }
  }

  if (!order) return <Loader />;

  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center bg-white py-8 mt-15">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Update Order</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Order ID
          </label>
          <input
            type="text"
            value={order.id}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Total Amount
          </label>
          <input
            type="text"
            value={order.totalAmount}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {OrderStatus.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleUpdateOrder}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        >
          Update Order
        </button>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/orders/list')}
            className="bg-gray-500 hover:bg-gray-700 text-white 
                font-bold py-2 px-4 rounded cursor-pointer"
          >
            Back to list
          </button>
        </div>
      </div>
    </div>
  );
}
