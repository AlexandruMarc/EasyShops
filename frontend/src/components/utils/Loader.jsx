import React from 'react';

import './Loader.css';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loader"></div>
      <div className="ml-4 text-2xl">{message}</div>
    </div>
  );
}
