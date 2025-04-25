import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Pagination from '../../../components/Pagination';
import UsersTable from '../../../components/user/UsersTable';
import Loader from '../../../components/utils/Loader';
import apiClient from '../../../services/apiClient';
import { useCreateNotification } from '../../../utils/toast';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const createNotification = useCreateNotification();

  async function getUsersList() {
    try {
      const { data } = await apiClient.get('/users/all');
      setUsers(data.data);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUsersList();
  }, []);

  if (loading) return <Loader />;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>
      <Link
        to="/admin/users/create"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition-colors mb-6 inline-block"
      >
        + Create New User
      </Link>
      <div className="overflow-x-auto">
        <UsersTable users={currentUsers} />
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
