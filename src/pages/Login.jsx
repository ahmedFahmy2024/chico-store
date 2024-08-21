import { useRef, useEffect, useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LOGIN, SETTINGS, baseUrl } from '../api/Api';

import ToastContext from '../context/ToastProvider';
import { LocalContext } from '../context/LocalContext';
import { useTranslation } from 'react-i18next';
import Cookie from 'cookie-universal'

import '../css/login.css';
import axios from 'axios';

export default function Login() {
    const [logo, setLogo] = useState('');
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);

    const cookies = Cookie()
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const userRef = useRef();


    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');

    // logo
    useEffect(() => {
        setLoading(true);
        axios.get(`${baseUrl}${SETTINGS}`)
            .then(response => {
                // console.log(response.data);
                const logoUrl = response.data.map(item => item.value);
                setLogo(logoUrl[0]);
                setLoading(false);
            })
            .catch(function (error) {
                let errorMessage = (t('An error occurred. Please try again.'));
                if (error.response) {
                    if (error.response.status === 404) {
                        errorMessage = (t('Resource not found.'));
                    } else if (error.response.status === 500) {
                        errorMessage = (t('Internal server error. Please try again later.'));
                    } else {
                        errorMessage = (t('An unexpected error occurred. Please try again later.'));
                    }
                }
                showHideToast(errorMessage, "error");
                setLoading(false);
            })
    }, []);
    // logo

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}${LOGIN}`,
                { email: email, password: pwd },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            // console.log(response);
            const accessToken = response?.data?.access_token;
            const roles = response?.data?.user?.is_admin;
            cookies.set('e-commerce', accessToken)
            showHideToast(t("login success"));
            setEmail('');
            setPwd('');
            // navigate(from, { replace: true });
            setLoading(false);
            window.location.pathname = '/dashboard';
        } catch (err) {
            let errorMessage = (t('An error occurred. Please try again.'));
            if (err.response) {
                if (err.response.status === 400) {
                    errorMessage = (t('Enter valid email. Please check your input.'));
                } else if (err.response.status === 401) {
                    errorMessage = (t('Unauthorized. Please log in again.'));
                } else if (err.response.status === 403) {
                    errorMessage = (t('Forbidden. You do not have permission to perform this action.'));
                } else if (err.response.status === 404) {
                    errorMessage = (t('Resource not found.'));
                } else if (err.response.status === 500) {
                    errorMessage = (t('Internal server error. Please try again later.'));
                } else {
                    errorMessage = (t('An unexpected error occurred. Please try again later.'));
                }
            }
            showHideToast(errorMessage, "error");
            setLoading(false);
        }
    }

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

    return (
        <div className="login-main">
            <div className="login">
                <div>
                    <img style={{ maxWidth: '100%', height: '68px', marginBottom: '20px' }} src={logo} alt="logo" />
                </div>
                <form onSubmit={handleSubmit}>
                    <TextField autoFocus size='small' sx={{ marginBottom: 1 }} required value={email} onChange={(e) => setEmail(e.target.value)} ref={userRef} id="username" autoComplete="off" label={t("Email")} variant="outlined" />
                    <TextField size='small' sx={{ marginBottom: 1 }} required value={pwd} onChange={(e) => setPwd(e.target.value)} ref={userRef} id="password" label={t("Password")} variant="outlined" type="password" />
                    <button>{t("Sign In")}</button>
                </form>
                <div className="login-footer">{t("Copyright © 2024 Chico Store. All rights reserved.")}</div>
            </div >
        </div>
    )
}
