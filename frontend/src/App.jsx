import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Loader from './components/utils/Loader.jsx';
import { ShoppingCartContext } from './context/Contex';
import { login, logout } from './features/auth';
import CategoryList from './pages/admin/category/list.jsx';
import OrdersList from './pages/admin/order/list.jsx';
import UpdateOrder from './pages/admin/order/update.jsx';
import CreateAndUpdateProduct from './pages/admin/product/create-update.jsx';
import ProductsList from './pages/admin/product/list.jsx';
import CreateAndUpdateUser from './pages/admin/user/create-update.jsx';
import UsersList from './pages/admin/user/list.jsx';
import Cart from './pages/cart/Cart.jsx';
import OrderDetails from './pages/order/OrderDetails.jsx';
import PlacedOrder from './pages/order/PlacedOrder.jsx';
import Summary from './pages/order/Summary.jsx';
import ProductDetails from './pages/product/ProductDetails.jsx';
import ProductList from './pages/product/ProductList.jsx';
import Admin from './pages/profile/Admin.jsx';
import Profile from './pages/profile/Profile.jsx';
import Login from './pages/user/login.jsx';
import Register from './pages/user/register.jsx';
import apiClient from './services/apiClient.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <ProductList />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/product-details/:id',
        element: <ProductDetails />,
      },
      {
        path: '/cart',
        element: (
          <ProtectedRoute message="To access the cart, you need to be logged in." />
        ),
        children: [
          {
            path: 'my',
            element: <Cart />,
          },
          {
            path: 'checkout',
            element: <OrderDetails />,
          },
          {
            path: 'summary',
            element: <Summary />,
          },
          {
            path: 'placed',
            element: <PlacedOrder />,
          },
        ],
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/admin',
        element: <ProtectedRoute requiredRole="ROLE_ADMIN" />,
        children: [
          {
            path: 'panel',
            element: <Admin />,
          },
          {
            path: 'categories',
            element: <CategoryList />,
          },
          {
            path: 'users',
            element: <Outlet />,
            children: [
              {
                path: 'list',
                element: <UsersList />,
              },
              {
                path: 'create',
                element: <CreateAndUpdateUser />,
              },
              {
                path: 'update/:id',
                element: <CreateAndUpdateUser />,
              },
            ],
          },
          {
            path: 'products',
            element: <Outlet />,
            children: [
              {
                path: 'list',
                element: <ProductsList />,
              },
              {
                path: 'create',
                element: <CreateAndUpdateProduct />,
              },
              {
                path: 'update/:id',
                element: <CreateAndUpdateProduct />,
              },
            ],
          },
          {
            path: 'orders',
            element: <Outlet />,
            children: [
              {
                path: 'list',
                element: <OrdersList />,
              },
              {
                path: 'update/:id',
                element: <UpdateOrder />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const { setCartId } = useContext(ShoppingCartContext);
  const [loading, setLoading] = useState(true);

  async function setUserSession() {
    try {
      const { data, status } = await apiClient.get('/auth/session');

      if (status === 200 && data.data) {
        const user = data.data;
        const role = user.authorities[0]?.authority;
        dispatch(login({ email: user.email, role: role, userId: user.id }));
        if (user.cartId) {
          setCartId(user.cartId);
        }
      }
    } catch (error) {
      dispatch(logout());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setUserSession();
  }, []);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        draggable
      />
    </Fragment>
  );
}

export default App;
