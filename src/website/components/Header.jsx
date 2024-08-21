import React from 'react'
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../../theme';
import { LocalContext } from '../../context/LocalContext';
import { RefContext } from '../context/RefContext';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useFilter } from '../context/FilterProvider';
import '../css/header.css'
import { useCart } from '../context/CartProvider';

import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import Container from '@mui/material/Container';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';

const array1 = [
  { key: 'home', icon: <Icon icon="mynaui:home" />, path: ".", },
  { key: 'cart', icon: <Icon icon="solar:cart-large-4-linear" />, path: "/cart", },
  { key: 'instagram', icon: <InstagramIcon />, },
  { key: 'whatsapp', icon: <WhatsAppIcon />, },
];

function Header() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  let location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { productListRef } = useContext(RefContext);

  const { filters: { text }, updateFilterValue } = useFilter()
  const { total_items } = useCart()

  function handleChangeLanguage() {
    const newLocale = locale === "en" ? "ar" : "en";
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
    localStorage.setItem("language", newLocale);
  }

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLocale(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  const isProductPage = location.pathname.startsWith('/product/');

  // ================ search ==================

  useEffect(() => {
    // Function to handle clicks outside the search input and product list
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        productListRef.current &&
        !productListRef.current.contains(event.target)
      ) {
        updateFilterValue({ target: { name: 'text', value: '' } });
      }
    };

    // Adding event listener to listen for clicks outside the search input and product list
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [updateFilterValue]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate('/', { state: { fromSearch: true } });
    updateFilterValue({ target: { name: 'text', value: text } });
  };

  // ================ search ==================

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "headerpage"].join(' ')}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
            {location.pathname !== '/' && (
              <IconButton className='back' aria-label="back" onClick={() => navigate(-1)}>
                {locale === "en" ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
              </IconButton>
            )}

            <form onSubmit={handleFormSubmit} className='search-form'>
              <Stack className='search-Container' direction="row" alignItems="center">
                <SearchIcon />
                <input ref={inputRef} className='search-input' type="text" name='text' placeholder={t('search')} value={text} onChange={updateFilterValue} />
              </Stack>
            </form>
          </Stack>

          <Stack className='header-icons-margin' direction="row" gap={2} alignItems="center" justifyContent="flex-end">

            <Link to={'/cart'} style={{ textDecoration: 'none', color: 'black' }}>
              <IconButton sx={{ padding: "0px" }}>
                <Badge badgeContent={total_items} showZero color="error" >
                  <Icon icon="solar:cart-large-4-linear" width="22" height="22" />
                </Badge>
              </IconButton>
            </Link>

            <Stack>
              {theme.palette.mode === "light" ? (
                <IconButton
                  onClick={() => {
                    localStorage.setItem(
                      "mode",
                      theme.palette.mode === "dark" ? "light" : "dark"
                    );
                    colorMode.toggleColorMode();
                  }}
                  color="inherit"
                  sx={{ padding: "0px" }}
                >
                  <LightModeOutlinedIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    localStorage.setItem(
                      "mode",
                      theme.palette.mode === "dark" ? "light" : "dark"
                    );
                    colorMode.toggleColorMode();
                  }}
                  color="inherit"
                  sx={{ padding: "0px" }}
                >
                  <DarkModeOutlinedIcon />
                </IconButton>
              )}
            </Stack>

            <Stack>
              {locale === "ar" ? (<IconButton sx={{ padding: "0px" }} onClick={() => {
                handleChangeLanguage()
              }}>
                <span id='switcheren' style={{ fontSize: "14px", color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>EN</span>
              </IconButton>) : (<IconButton sx={{ padding: "0px" }} onClick={() => handleChangeLanguage()}>
                <span id='switcherar' style={{ fontSize: "14px", color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>AR</span>
              </IconButton>)}
            </Stack>

          </Stack>
        </Stack>
      </Container>
      <div className='website-pages'>
        <Outlet />
      </div>

      {!isProductPage && (
        <div className='mobile' style={{ backgroundColor: theme.palette.mode === 'dark' ? '#0f0f0f' : '#f1f4fb' }}>
          <List sx={{ color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>
            {array1.map((item) => (
              <ListItem sx={{ ".MuiTypography-root": { fontSize: "14px !important" }, display: "flex", alignItems: "center" }} key={item.key} disablePadding>
                <ListItemButton className={location.pathname === item.path ? 'active' : ''} sx={{ bgcolor: location.pathname === item.path ? theme.palette.mode === "light" ? "#f7f7f7" : "#f7f7f714" : "transparent" }} component={Link} to={item.path}>
                  <ListItemIcon className='icons'>
                    {item.key === 'cart' ? (
                      <Badge badgeContent={total_items} showZero color="error">
                        <Icon icon="solar:cart-large-4-linear" width="22" height="22" />
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      )}


    </div>
  )
}

export default Header