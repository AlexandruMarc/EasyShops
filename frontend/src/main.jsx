import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.jsx';
import ShoppingCartProvider from './context/Contex.jsx';
import './index.css';
import store from './store';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ShoppingCartProvider>
        <App />
      </ShoppingCartProvider>
    </Provider>
  </React.StrictMode>,
);
