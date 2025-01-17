import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Stack } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../theme';
import { LocalContext } from '../context/LocalContext';

import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/header.css'
import Logout from './Logout';


export default function Header({ onMenuIconClick }) {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const { locale, setLocale } = useContext(LocalContext);
    const { t, i18n } = useTranslation();

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

    return (
        <Box dir={locale === "en" ? "ltr" : "rtl"} sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ backgroundColor: theme.palette.mode === "light" ? "#fff" : theme.palette.background.default, justifyContent: "space-between" }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color={theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary}
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={onMenuIconClick}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Stack direction={"row"} spacing={2} alignItems={"center"} justifyContent={"flex-start"} sx={{ padding: "8px 16px 0", fontSize: "11px", color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary, fontWeight: "bold" }}>
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
                                >
                                    <DarkModeOutlinedIcon />
                                </IconButton>
                            )}
                        </Stack>
                        <Stack>
                            {locale === "ar" ? (<IconButton onClick={() => {
                                handleChangeLanguage()
                            }}>
                                <span id='switcheren' style={{ fontSize: "14px", color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>EN</span>
                            </IconButton>) : (<IconButton onClick={() => handleChangeLanguage()}>
                                <span id='switcherar' style={{ fontSize: "14px", color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>AR</span>
                            </IconButton>)}
                        </Stack>
                        <Stack direction="row" sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            
                            {/* <Typography sx={{ fontSize: "14px", color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>Admin</Typography> */}
                            <Logout />
                        </Stack>

                    </Stack>

                </Toolbar>

            </AppBar>
        </Box>
    );
}