import React, { useEffect, useState } from 'react';

import Pagination from '../../../components/Pagination';
import OrdersTable from '../../../components/order/OrdersTable';
import Loader from '../../../components/utils/Loader';
import apiClient from '../../../services/apiClient';
import { useCreateNotification } from '../../../utils/toast';

export default function OrdersList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
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

  async function getUserOrders(userId) {
    try {
      const { data } = await apiClient.get(`/orders/${userId}/user-orders`);

      setOrders(data.data);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  async function getUserById(userId) {
    try {
      const { data } = await apiClient.get(`/users/${userId}/user`);
      return data.data;
    } catch (error) {
      createNotification({ message: error, type: 'error' });
      return null;
    }
  }

  useEffect(() => {
    getUsersList();
    const storedUserId = localStorage.getItem('selectedUserId');
    if (storedUserId) {
      (async () => {
        const user = await getUserById(storedUserId);
        if (user) {
          setSelectedUser(user);
          await getUserOrders(user.id);
        }
      })();
    }
  }, []);

  const handleUserSelect = async (e) => {
    const userId = e.target.value;
    setLoading(true);
    try {
      const user = await getUserById(userId);
      if (user) {
        setSelectedUser(user);
        localStorage.setItem('selectedUserId', user.id);
        await getUserOrders(user.id);
      }
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnotherUser = () => {
    setSelectedUser(null);
    setOrders([]);
    localStorage.removeItem('selectedUserId');
  };

  if (loading) return <Loader />;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(
    indexOfFirstOrder,
    indexOfFirstOrder + ordersPerPage,
  );

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto mt-15">
      {!selectedUser ? (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm mx-auto mt-15">
          <h2 className="text-2xl font-bold mb-4">Select User</h2>
          <select
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            onChange={handleUserSelect}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Orders for {selectedUser.email}
          </h1>
          <button
            onClick={handleSelectAnotherUser}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 cursor-pointer"
          >
            Select Another User
          </button>
          <OrdersTable orders={currentOrders} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
