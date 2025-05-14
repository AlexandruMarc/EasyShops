import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { login, logout } from './auth/auth.js';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Loader from './components/utils/Loader.jsx';
import { ShoppingCartContext } from './context/ShoppingCartContext.jsx';
import Admin from './routes/admin/admin-panel.jsx';
import CategoryList from './routes/admin/category/list.jsx';
import OrdersList from './routes/admin/order/list.jsx';
import UpdateOrder from './routes/admin/order/update.jsx';
import CreateAndUpdateProduct from './routes/admin/product/create-update.jsx';
import ProductsList from './routes/admin/product/list.jsx';
import CreateAndUpdateUser from './routes/admin/user/create-update.jsx';
import UsersList from './routes/admin/user/list.jsx';
import Cart from './routes/cart/cart.jsx';
import OrderDetails from './routes/order/order-details.jsx';
import PlacedOrder from './routes/order/placed-order.jsx';
import Summary from './routes/order/summary.jsx';
import ProductDetails from './routes/product/product-details.jsx';
import ProductList from './routes/product/product-list.jsx';
import Login from './routes/user/login.jsx';
import Profile from './routes/user/profile.jsx';
import Register from './routes/user/register.jsx';
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
