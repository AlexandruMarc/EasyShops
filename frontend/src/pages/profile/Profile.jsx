import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AddressList from '../../components/user/AddressList';
import EditProfileModal from '../../components/user/EditProfileModal';
import OrderList from '../../components/user/OrderList';
import ProfileDetails from '../../components/user/ProfileDetails';
import Loader from '../../components/utils/Loader';
import { logout } from '../../features/auth';
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
    <div className="container mx-auto mt-5 ">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex">
        <div className="w-2/3 ">
          <ProfileDetails
            userDetails={userDetails}
            setIsEditing={setIsEditing}
            onProfileImageUpdate={handleProfileImageUpdate}
          />
          <OrderList orders={userDetails.orders} />
        </div>
        <div className="w-1/3">
          <AddressList userId={userId} />
          <div className="mt-4 flex justify-start w-[700px] ">
            <button
              onClick={handleDeleteAccount}
              className="shadow-lg border-2 border-b-4 border-red-900 bg-red-400 hover:bg-red-800 text-white font-bold ml-6 mt-20 w-[460px] py-2 px-4 rounded cursor-pointer"
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
