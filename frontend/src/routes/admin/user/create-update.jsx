import { faSquareCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import apiClient from '../../../services/apiClient';
import { useCreateNotification } from '../../../utils/toast';

export default function CreateAndUpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const createNotification = useCreateNotification();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
  });
  const [roles, setRoles] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    getRoles();
    if (id) {
      setIsUpdate(true);
      getUserDetails();
    }
  }, [id]);

  async function getRoles() {
    try {
      const { data } = await apiClient.get('/users/roles/all');
      setRoles(data.data);
    } catch (error) {
      createNotification({
        message: 'Failed to fetch roles',
        type: 'error',
      });
    }
  }

  async function getUserDetails() {
    try {
      const { data } = await apiClient.get(`/users/${id}/user`);
      setUser({
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
        password: '',
        role: data.data.roles[0],
      });
    } catch (error) {
      createNotification({
        message: 'Failed to get user details',
        type: 'error',
      });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isUpdate) {
        const { data } = await apiClient.put(`/users/update/${id}/user`, user);
        createNotification({
          message: data.message,
          type: 'success',
        });
      } else {
        const { data } = await apiClient.post('/users/create/user', user);
        createNotification({
          message: data.message,
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error in catch block:', error);
      createNotification({ message: error.message, type: 'error' });
    }
  }

  return (
    <div className="container mx-auto mt-15 shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isUpdate ? 'Update User' : 'Create User'}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 
                text-gray-700 leading-tight"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 
                text-gray-700 leading-tight"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 
                text-gray-700 leading-tight"
            required
          />
        </div>
        {!isUpdate && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 
                text-gray-700 leading-tight"
              required={!isUpdate}
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Role
          </label>
          <div className="relative">
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 
                pr-8 text-gray-700 leading-tight"
              required
            >
              <option value="">Select a role</option>
              {roles &&
                roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
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
        <div className="flex items-center justify-between col-span-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
                py-2 px-4 rounded cursor-pointer"
          >
            {isUpdate ? 'Update User' : 'Create User'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/users/list')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold 
                py-2 px-4 rounded cursor-pointer"
          >
            Back to list
          </button>
        </div>
      </form>
    </div>
  );
}
