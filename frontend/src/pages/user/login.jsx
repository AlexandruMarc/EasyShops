import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { login } from '../../auth/auth.js';
import { ShoppingCartContext } from '../../context/ShoppingCartContext.jsx';
import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setCartId, setUserId } = useContext(ShoppingCartContext);
  const navigate = useNavigate();
  const createNotification = useCreateNotification();
  const dispatch = useDispatch();
  const location = useLocation();
  const message = location.state?.message;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4 max-w-sm text-center animate-hippo-bounce">
          <strong className="font-bold">You are already logged in!</strong>
          <p>Please logout to access this page.</p>
          <div className="mt-4">
            <img
              src="/hippo-solid.svg"
              alt="Hippo Icon"
              className="w-16 h-16 mx-auto animate-hippo-bounce"
            />
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      const user = data.data;
      setCartId(user.cartId);
      setUserId(user.id);
      dispatch(login({ email: user.email, role: user.role, userId: user.id }));
      navigate('/');
      setTimeout(() => {
        createNotification({ message: 'Welcome' });
      }, 2000);
    } catch (err) {
      setError('Email or password is incorrect. Please try again.');
    }
  }

  return (
    <div className="min-h-[65vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-2xl border-2 border-b-4 border-gray-200 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {message && (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Notice:</strong>
            <span className="block sm:inline"> {message}</span>
          </div>
        )}
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
          >
            Login
          </button>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <Link
            to="/register"
            className="text-sm text-blue-500 hover:underline"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
