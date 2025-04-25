import React, { useRef, useState } from 'react';

import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';
import ChangePasswordModal from './ChangePassword';

const URL = 'http://localhost:8080';

export default function ProfileDetails({
  userDetails,
  setIsEditing,
  onProfileImageUpdate,
}) {
  const fileInputRef = useRef(null);
  const createNotification = useCreateNotification();
  const [showChangePassword, setShowChangePassword] = useState(false);

  async function handleImageClick() {
    fileInputRef.current.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      let response;
      if (userDetails.image === null) {
        formData.append('userId', userDetails.id);
        response = await apiClient.post('/images/user/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await apiClient.put(
          `/images/image/${userDetails.image.imageId}/update`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
      }
      onProfileImageUpdate(response.data.data);
    } catch (error) {
      createNotification({
        message: 'Error uploading/updating profile image',
        type: 'error',
      });
    }
  }

  return (
    <div className="bg-white border-l-black p-6 rounded shadow-2xl border-2 border-b-4 border-gray-200 w-full max-w-[45rem] mx-auto">
      <h1 className="w-50 text-2xl font-bold mb-6">Account Info</h1>
      <div className="flex items-center">
        <div
          className="w-24 h-24 bg-gray-700 rounded-full mr-15 mb-12 cursor-pointer overflow-hidden flex items-center justify-center"
          onClick={handleImageClick}
        >
          {userDetails.image && userDetails.image.downloadURL ? (
            <img
              src={`${URL}${userDetails.image.downloadURL}?t=${new Date().getTime()}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white">Image</span>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <p className="text-gray-700">{userDetails.email}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <p className="text-gray-700">
              {userDetails.firstName} {userDetails.lastName}
            </p>
          </div>
          <div className="flex items-center justify-start space-x-3">
            <button
              onClick={() => setIsEditing(true)}
              className="shadow-lg border-2 border-b-4 border-gray-800 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer active:shadow-sm active:border-b-2 active:translate-y-1"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setShowChangePassword(true)}
              className="shadow-lg border-2 border-b-4 border-gray-800 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer active:shadow-sm active:border-b-2 active:translate-y-1"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
}
