import React, { useState, useContext, useEffect } from 'react'
import { LocalContext } from '../context/LocalContext';
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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


export default function UsersEdit() {
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  //  ================ edit state ================
  const [updateInput, setUpdateInput] = useState({
    Name: '',
    Email: '',
    Password: '',
    Admin: false,
  })

  function handleForm(e) {
    setUpdateInput({ ...updateInput, [e.target.name]: e.target.value })
  }
  //  ================ edit state ================

      //  ====== get specific User ========
      useEffect(() => {
        setLoading(true);
        Axios.get(`${USERS}/${id}`,)
            .then(function (response) {
                // console.log(response.data.user);
                const data = response.data.user;
                setUpdateInput({
                    Name: data.name,
                    Email: data.email,
                    Admin: data.is_admin
                })
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast('Something went wrong, please try again', 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get specific User ========

  //  ================ edit function ================
  async function handleEditSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const params = {
      name: updateInput.Name,
      email: updateInput.Email,
      password: updateInput.Password,
      is_admin: updateInput.Admin ? "1" : "0"
    }
    try {
      const response = await Axios.put(`${USERS}/${id}`, params)
      // console.log(response);
      showHideToast(t("Updated successfully"));
      setLoading(false);
      navigate("/dashboard/users");
    } catch (error) {
      console.log(error);
      showHideToast('Something went wrong, please try again', 'error');
      setLoading(false);
    }
  }
  //  ================ edit function ================

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
          {t('Edit')}
        </h4>

        <Grid container spacing={2}>
          <Grid xs={12} md={8}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <TextField type='text' autoFocus name='Name' value={updateInput.Name} onChange={handleForm} fullWidth id="Name" label={t("User Name")} variant="outlined" />
                <TextField type='email' name='Email' value={updateInput.Email} onChange={handleForm} fullWidth id="Email" label={t("User Email")} variant="outlined" />
                <TextField type='password' name='Password' value={updateInput.Password} onChange={handleForm} fullWidth id="Password" label={t("User Password")} variant="outlined" />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>{t('Admin')}</span>
                  <Switch
                    checked={Boolean(updateInput.Admin)}
                    onChange={(e) => {
                      setUpdateInput({ ...updateInput, Admin: e.target.checked })
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
            <button onClick={handleEditSubmit} className='submitbtn' variant="contained" type="submit">{t('Save Changes')}</button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
