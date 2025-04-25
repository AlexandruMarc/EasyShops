import React, { useState } from 'react';

import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';

export default function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const createNotification = useCreateNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      createNotification({ message: "Passwords don't match !", type: 'error' });
      return;
    }

    try {
      const { data } = await apiClient.post('/users/change/password', {
        oldPassword,
        newPassword,
      });
      console.log(data);

      createNotification({ message: data.message, type: 'success' });
      onClose();
    } catch (error) {
      console.log(error);

      createNotification({ message: error, type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/45 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Change Password
            </button>
            <button
              type="button"
              onClick={onClose}
              className=" px-4 py-2 font-bold  bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
