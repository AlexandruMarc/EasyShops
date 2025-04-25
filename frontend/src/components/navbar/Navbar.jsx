import {
  faHippo,
  faMagnifyingGlass,
  faRightFromBracket,
  faShoppingCart,
  faUser,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { ShoppingCartContext } from '../../context/Contex';
import { logout } from '../../features/auth';
import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    setSearchResults,
    setSelectedProduct,
    cartItems,
    setCartItems,
    setSortOption,
    setCartId,
    setSelectedCategory,
    setSelectedBrand,
  } = useContext(ShoppingCartContext);
  const navigate = useNavigate();
  const createNotification = useCreateNotification();
  const dispatch = useDispatch();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const [userDetails, setUserDetails] = useState({});
  async function getUserDetails() {
    try {
      const { data } = await apiClient.get(`/users/${user.userId}/user`);
      setUserDetails(data.data);
    } catch (error) {
      //ignored
    }
  }

  async function performSearch(query) {
    try {
      const { data } = await apiClient.get(`/products/products/${query}/name`);
      setSearchResults(data.data);
      setSelectedProduct(0);
      navigate('/');
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  function handleChange(e) {
    setSearchQuery(e.target.value);
  }

  async function getAllProducts() {
    try {
      const { data } = await apiClient.get('/products/all');
      setSearchResults(data.data);
      setSelectedProduct(0);
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  async function handleLogout() {
    try {
      await apiClient.post('/auth/logout');
      setUserDetails({});
      setCartItems([]);
      setCartId(null);
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getUserDetails();
    } else {
      setUserDetails({});
    }

    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        getAllProducts();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [isAuthenticated, searchQuery, user]);

  return (
    <div>
      <div className="bg-white p-4 flex items-center justify-between shadow-lg border-2 border-b-4 border-gray-200 z-10">
        <div className="ml-44 pl-4">
          <Link
            to="/"
            onClick={() => {
              setSelectedProduct(0);
              setSearchResults(0);
              setSortOption('');
              setSelectedCategory('');
              setSelectedBrand('');
            }}
            className="text-black font-serif text-2xl hover:text-indigo-800 transition-colors animate-hippo-bounce"
          >
            <FontAwesomeIcon icon={faHippo} /> Easy-shops
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              performSearch(searchQuery);
            }}
            className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-320 shadow-sm hover:shadow-md transition-shadow"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleChange}
              className="p-2 border-none outline-none flex-grow"
              placeholder="Search..."
            />
            <button
              type="submit"
              className="bg-gray-800 text-white p-2 hover:bg-gray-700 transition-colors"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="p-1" />
            </button>
          </form>
        </div>

        <div className="mr-40 pr-4 flex items-center space-x-4">
          <div className="flex items-center justify-between space-x-10">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-700 hover:text-gray-900 flex items-center cursor-pointer transition-colors"
                >
                  {userDetails.image ? (
                    <img
                      src={
                        `http://localhost:8080${userDetails.image?.downloadURL}` ||
                        '/default-profile.png'
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="mr-1" />
                  )}
                  {userDetails.firstName} {userDetails.lastName}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-400 cursor-pointer transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FontAwesomeIcon icon={faUser} /> Profile
                    </Link>
                    {role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin/panel"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-400 cursor-pointer transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUserTie} /> Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-400 cursor-pointer transition-colors"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 flex items-center transition-colors"
              >
                <FontAwesomeIcon icon={faUser} className="mr-1" /> Login
              </Link>
            )}
            <Link
              to="/cart/my"
              className="text-gray-700 hover:text-gray-900 items-center relative transition-colors"
            >
              {cartItems.length > 0 && (
                <span className="absolute bottom-4 left-4 px-2 py-1 text-[10px] leading-none text-white bg-red-500 rounded-[12px]">
                  {totalItems}
                </span>
              )}
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="mr-1 h-[30px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
