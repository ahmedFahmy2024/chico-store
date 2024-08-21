import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'cookie-universal';
import { LOGOUT, baseUrl } from '../api/Api';
import '../css/logout.css';
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../context/LocalContext';
import { useContext } from 'react';
import ToastContext from '../context/ToastProvider';

export default function Logout() {
    const cookies = Cookie()
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const [loading, setLoading] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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

    async function handleLogout() {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}${LOGOUT}`, null, {
                headers: {
                    Authorization: `Bearer ${cookies.get('e-commerce')}`
                }
            });
            // console.log(response.data);
            cookies.remove('e-commerce');
            setLoading(false);
            showHideToast(t('Logged out successfully'), 'success');
            navigate('/login', { replace: true });
        } catch (error) {
            console.log(error);
            setLoading(false);
            showHideToast('Something went wrong, please try again', 'error');
        }
    }


    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "logout-container"].join(" ")}>
            <Avatar className='avatar-logout' onClick={handleClick} aria-expanded={open ? 'true' : undefined} aria-haspopup="true" aria-controls={open ? 'basic-menu' : undefined} id="basic-button" alt="Remy Sharp" src={require('../assets/avatar_25.jpg')} sx={{ width: 32, height: 32, bgcolor: "#4945ff" }} />
            <Menu
                className={[locale === "en" ? "ltr" : "rtl", "logout-menu"].join(" ")}
                sx={{ width: '200px' }}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem> */}
                <MenuItem key="logout-item" className='logout-menu' sx={{ color: 'rgb(255, 86, 48)', width: '200px', }} onClick={handleLogout}>{t("Logout")}</MenuItem>
            </Menu>
        </div>
    )
}
