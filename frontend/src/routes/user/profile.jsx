import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '../../auth/auth';
import AddressList from '../../components/user/AddressList';
import EditProfileModal from '../../components/user/EditProfileModal';
import ProfileDetails from '../../components/user/ProfileDetails';
import UserOrders from '../../components/user/UserOrders';
import Loader from '../../components/utils/Loader';
import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';

function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [originalUserDetails, setOriginalUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const createNotification = useCreateNotification();
  const userId = useSelector((state) => state.auth.user?.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function getUserDetails() {
    try {
      const { data } = await apiClient.get(`/users/${userId}/user`);
      setUserDetails(data.data);
      setOriginalUserDetails(data.data);
    } catch (error) {
      setError('Failed to get user details');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  async function handleUpdateUserData(e) {
    e.preventDefault();
    try {
      const payload = {
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        role: userDetails.roles[0],
      };
      const { data } = await apiClient.put(
        `/users/update/${userId}/user`,
        payload,
      );

      createNotification({ message: data.message, type: 'success' });
      setOriginalUserDetails(userDetails);
      setIsEditing(false);

      window.location.reload();
    } catch (error) {
      createNotification({
        message: 'Failed to update profile',
        type: 'error',
      });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }

  function handleCancelEdit() {
    setUserDetails(originalUserDetails);
    setIsEditing(false);
  }

  function handleProfileImageUpdate(responseData) {
    setUserDetails((prev) => ({
      ...prev,
      image: {
        ...prev.image,
        downloadURL: responseData.downloadURL + `?t=${new Date().getTime()}`,
      },
    }));
  }

  async function handleDeleteAccount() {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      try {
        const { data } = await apiClient.delete(`/users/delete/${userId}/user`);
        await apiClient.post('/auth/logout');
        dispatch(logout());
        createNotification({ message: data.message, type: 'success' });
        navigate('/login');
      } catch (error) {
        createNotification({
          message: error,
          type: 'error',
        });
      }
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container p-4 mt-5">
      <h1 className="text-2xl w-[2000px] font-bold ml-44 pl-4 mr-40 pr-4 mb-4 text-center">
        Profile
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex w-[2000px] ml-44 pl-4 mr-40 pr-4">
        {/* Left Section: Orders */}
        <div className="w-1/3 pr-4">
          <UserOrders orders={userDetails.orders} />
        </div>

        {/* Middle Section: Profile Details */}
        <div className="w-1/3 px-4">
          <ProfileDetails
            userDetails={userDetails}
            setIsEditing={setIsEditing}
            onProfileImageUpdate={handleProfileImageUpdate}
          />
        </div>

        {/* Right Section: Addresses and Delete Account */}
        <div className="w-1/3 pl-4">
          <AddressList userId={userId} />
          <div className="mt-4 flex justify-start">
            <button
              onClick={handleDeleteAccount}
              className="shadow-lg border-2 border-b-4 border-red-900 bg-red-400 hover:bg-red-800 text-white font-bold w-full py-2 px-4 rounded cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          userDetails={userDetails}
          handleChange={handleChange}
          handleUpdateUserData={handleUpdateUserData}
          setIsEditing={setIsEditing}
          handleCancelEdit={handleCancelEdit}
        />
      )}
    </div>
  );
}

export default Profile;
