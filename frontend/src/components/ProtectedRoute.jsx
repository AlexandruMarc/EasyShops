import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ requiredRole, message }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, message }} />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="container mx-auto mt-5">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Access Denied!</strong>
          <span className="block sm:inline">
            {' '}
            You do not have permission to view this page.
          </span>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
