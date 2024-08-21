import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProductProvider from './website/context/ProductProvider';
import FilterProvider from './website/context/FilterProvider';
import CartProvider from './website/context/CartProvider';
import SettingsProvider from './website/context/SettingsProvider';
import CheckOutProvider from './website/context/CheckOutProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ProductProvider>
      <FilterProvider>
        <CartProvider>
          <SettingsProvider>
            <CheckOutProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/*" element={<App />} />
                </Routes>
              </BrowserRouter>
            </CheckOutProvider>
          </SettingsProvider>
        </CartProvider>
      </FilterProvider>
    </ProductProvider>
  </React.StrictMode>
);

reportWebVitals();
