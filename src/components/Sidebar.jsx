import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Icon } from '@iconify/react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { LocalContext } from '../context/LocalContext';
import { useContext, useState, useEffect } from 'react';
import { Axios} from '../api/Axios';
import { PROFILE } from '../api/Api';
import { useNavigate } from 'react-router-dom';

const array1 = [
  { key: 'dashboard', icon: <Icon width='22' height='22' icon="tabler:dashboard" />, path: "/dashboard", role: [1] },
  { key: 'categories', icon: <Icon width='22' height='22' icon="solar:bill-check-outline" />, path: "/dashboard/categories", role: [1] },
  { key: 'products', icon: <Icon icon="solar:hanger-2-linear" width="22" height="22" />, path: "/dashboard/products", role: [1] },
  { key: 'orders', icon: <Icon icon="solar:cart-large-4-linear" width="22" height="22" />, path: "/dashboard/orders", role: [1] },
  { key: 'transaction', icon: <Icon width='22' height='22' icon="ep:money" />, path: "/dashboard/transaction", role: [1] },
  { key: 'users', icon: <Icon width='22' height='22' icon="mage:users" />, path: "/dashboard/users", role: [1] },
  { key: 'Settings', icon: <Icon width='22' height='22' icon="icons8:services" />, path: "/dashboard/settings", role: [1] },
];

function Sidebar({ open, onClose }) {
  const [user, setUser] = useState("");
  let location = useLocation();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { locale, setLocale } = useContext(LocalContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    Axios.get(`${PROFILE}`)
        .then(response => {
            // console.log(response.data.user);
            setUser(response.data.user)
            setLoading(false)
        })
        .catch(function (error) {
            console.log(error);
            setLoading(false);
            navigate('/login', { replace: true });
        })
}, [])

    // ================= loading =================
    if (loading) {
      return (
          <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open
          >
              <CircularProgress color="inherit" />
          </Backdrop>
      )
  }

  const list = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <List sx={{ color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>
        {array1.map((item) => (
          item.role.includes(user?.is_admin) && (
          <ListItem sx={{ ".MuiTypography-root": { fontSize: "14px !important" } }} key={item.path} disablePadding>
            <ListItemButton sx={{ bgcolor: location.pathname === item.path ? theme.palette.mode === "light" ? "#f7f7f7" : "#f7f7f714" : "transparent" }} component={Link} to={item.path}>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={t(item.key)} />
            </ListItemButton>
          </ListItem>
          )
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "sidebar"].join(" ")} >
      <Drawer
        anchor='left'
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            transform: 'none !important',
          }
        }}
      >
        {list}
      </Drawer>
    </div>
  );
}

export default Sidebar;
