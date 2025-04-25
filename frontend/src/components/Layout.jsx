import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import CheckoutNavbar from './navbar/CheckoutNavbar';
import Navbar from './navbar/Navbar';

export default function Layout() {
  const location = useLocation();
  const isCheckout =
    location.pathname.startsWith('/cart/checkout') ||
    location.pathname.startsWith('/cart/summary') ||
    location.pathname.startsWith('/cart/placed');

  return (
    <div>
      {isCheckout ? <CheckoutNavbar /> : <Navbar />}
      <Outlet />
    </div>
  );
}
