import { useState, useContext } from 'react'
import { LocalContext } from '../context/LocalContext';
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Axios } from '../api/Axios';
import { USERS } from '../api/Api';
import '../css/usersadd.css';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';


export default function UsersAdd() {
  const [users, setUsers] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  //  ================ add state ================
  const [addInput, setAddInput] = useState({
    Name: '',
    Email: '',
    Password: '',
    Admin: false,
  })

  function handleForm(e) {
    setAddInput({ ...addInput, [e.target.name]: e.target.value })
  }
  //  ================ add state ================

  //  ================ add function ================
  async function handleDialogSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const params = {
      name: addInput.Name,
      email: addInput.Email,
      password: addInput.Password,
      is_admin: addInput.Admin
    }
    try {
      const response = await Axios.post(`${USERS}`, params)
      // console.log(response);
      showHideToast(t("Added successfully"));
      setAddInput({
        Name: '',
        Email: '',
        Password: '',
        Admin: false
      })
      setLoading(false);
      navigate("/dashboard/users");
    } catch (error) {
      console.log(error);
      showHideToast('Something went wrong, please try again', 'error');
      setLoading(false);
    }
  }
  //  ================ add function ================

  const btnIsDisabled = !addInput.Name || !addInput.Email || !addInput.Password

  let btnClasses = ""
  if (btnIsDisabled) {
    btnClasses = "disabled"
  } else {
    btnClasses = "submitbtn"
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "usersadd"].join(" ")}>
      <Container maxWidth="lg">
        <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
          {t('Create a new User')}
        </h4>

        <Grid container spacing={2}>
          <Grid xs={12} md={8}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <TextField type='text' autoFocus name='Name' value={addInput.Name} onChange={handleForm} fullWidth id="Name" label={t("User Name")} variant="outlined" />
                <TextField type='email' name='Email' value={addInput.Email} onChange={handleForm} fullWidth id="Email" label={t("User Email")} variant="outlined" />
                <TextField type='password' name='Password' value={addInput.Password} onChange={handleForm} fullWidth id="Password" label={t("User Password")} variant="outlined" />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>{t('Admin')}</span>
                  <Switch
                    checked={addInput.Admin}
                    onChange={(e) => {
                      setAddInput({ ...addInput, Admin: e.target.checked })
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
            <button
              onClick={handleDialogSubmit}
              disabled={btnIsDisabled}
              className={btnClasses} variant="contained" type="submit">{t('Create User')}</button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
