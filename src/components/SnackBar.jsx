import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';
import { LocalContext } from '../context/LocalContext'
import "../css/snackbar.css"

export default function SnackBar({ openSb, message, severity }) {
    const { locale, setLocale } = useContext(LocalContext);
    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "snackbar"].join(" ")}>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Snackbar
                    open={openSb}
                    autoHideDuration={6000}
                    message="Note archived"
                    action={action}
                >
                    <Alert variant="filled" severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    );
}