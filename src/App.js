import './App.css';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { ToastProvider } from './context/ToastProvider';
import { useState, useRef, useEffect } from 'react';
import { LocalContext } from "./context/LocalContext";
import { RefContext } from "./website/context/RefContext";
import 'swiper/css';


import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import ProductsAdd from "./fullpage/ProductsAdd";
import ProductsEdit from "./fullpage/ProductsEdit";
import CategoryAdd from "./fullpage/CategoryAdd";
import CategoryEdit from "./fullpage/CategoryEdit";
import OrdersAdd from "./fullpage/OrdersAdd";
import OrdersEdit from "./fullpage/OrdersEdit";
import OrdersView from './fullpage/OrdersView';
import Login from './pages/Login';
import UsersAdd from './fullpage/UsersAdd';
import UsersEdit from './fullpage/UsersEdit';
import Transaction from './pages/Transaction';
import TranscationAdd from './fullpage/TranscationAdd';
import TranscationEdit from './fullpage/TranscationEdit';
import RequireAuth from './auth/RequireAuth';
import Page404 from './pages/Page404';
import Settings from './pages/Settings';
import Home from './website/pages/Home';
import OneProduct from './website/pages/OneProduct';
import Cart from './website/pages/Cart';
import Thanks from './website/pages/Thanks';
import Header from './website/components/Header';
import HomeDashboard from './pages/HomeDashboard';
import { initFacebookPixel, logPageView } from './website/helpers/fbPixel';


function App() {
  const [locale, setLocale] = useState("ar");
  const [theme, colorMode] = useMode();
  const productListRef = useRef(null);

  // direction right and left
  const rtlCache = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
  const ltrCache = createCache({
    key: 'mui',
  });

  useEffect(() => {
    initFacebookPixel();
    logPageView();
  }, []);

  return (
    <div className='App'>
      <CacheProvider value={locale === "ar" ? rtlCache : ltrCache}>
        <LocalContext.Provider value={{ locale, setLocale }}>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <ToastProvider>
                <CssBaseline />
                <RefContext.Provider value={{ productListRef }}>
                  <Routes>

                    {/* Public Routes */}
                    <Route path="/" element={<Header />}>
                      <Route index element={<Home />} />
                      <Route path="product/:id" element={<OneProduct />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="thanks" element={<Thanks />} />
                    </Route>

                    {/* Protected Routes */}
                    <Route path="/login" element={<Login />} />

                    <Route element={<RequireAuth allowedRoles={[1]} />}>
                      <Route path="/dashboard" element={<Dashboard />} >
                        <Route element={<RequireAuth allowedRoles={[1]} />}>
                          <Route index element={<HomeDashboard />} />
                          <Route path="products" element={<Products />} />
                          <Route path="products/new" element={<ProductsAdd />} />
                          <Route path="products/:id/edit" element={<ProductsEdit />} />
                          <Route path="orders" element={<Orders />} />
                          <Route path="orders/new" element={<OrdersAdd />} />
                          <Route path="orders/:id/edit" element={<OrdersEdit />} />
                          <Route path="orders/:id/details" element={<OrdersView />} />
                          <Route path="users" element={<Users />} />
                          <Route path="users/:id/edit" element={<UsersEdit />} />
                          <Route path="users/new" element={<UsersAdd />} />
                          <Route path="settings" element={<Settings />} />
                          <Route path="categories" element={<Categories />} />
                          <Route path="categories/new" element={<CategoryAdd />} />
                          <Route path="categories/:id/edit" element={<CategoryEdit />} />
                          <Route path="transaction" element={<Transaction />} />
                          <Route path="transaction/:id/edit" element={<TranscationEdit />} />
                          <Route path="transaction/new" element={<TranscationAdd />} />
                        </Route>
                      </Route>
                    </Route>

                    {/* Catch All */}
                    <Route path='/*' element={<Page404 />} />

                  </Routes>
                </RefContext.Provider>
              </ToastProvider>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </LocalContext.Provider>
      </CacheProvider>
    </div>
  );
}

export default App;
