import { useState, useContext, useEffect } from 'react'
import { LocalContext } from '../context/LocalContext';
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Axios } from '../api/Axios';
import { ORDERS, TRANSCATION } from '../api/Api';

import '../css/usersadd.css';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';


export default function TranscationAdd() {
  const [orders, setOrders] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  //  ====== get all orders ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${ORDERS}`,)
      .then(function (response) {
        // console.log(response.data.orders);
        setOrders(response.data.orders);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast('Something went wrong, please try again', 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get all orders ========

  //  ================ add state ================
  const [addInput, setAddInput] = useState({
    OrderId: '',
    TransactionId: '',
    PaymentMethod: '',
    Amount: '',
    Status: '',
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
      order_id: addInput.OrderId,
      transaction_id: addInput.TransactionId,
      payment_method: addInput.PaymentMethod,
      amount: addInput.Amount,
      status: addInput.Status
    }
    try {
      const response = await Axios.post(`${TRANSCATION}`, params)
      // console.log(response);
      showHideToast(t("Added successfully"));
      setAddInput({
        OrderId: '',
        TransactionId: '',
        PaymentMethod: '',
        Amount: '',
        Status: '',
      })
      setLoading(false);
      navigate("/dashboard/transaction");
    } catch (error) {
      console.log(error);
      showHideToast('Something went wrong, please try again', 'error');
      setLoading(false);
    }
  }
  //  ================ add function ================

  const btnIsDisabled = !addInput.OrderId || !addInput.PaymentMethod || !addInput.Amount || !addInput.Status

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
          {t('Create a new Transcation')}
        </h4>

        <Grid container spacing={2}>
          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Properties")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Additional functions and attributes..")}</p>
          </Grid>
          <Grid xs={12} md={8}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <TextField type='text' autoFocus name='TransactionId' value={addInput.TransactionId} onChange={handleForm} fullWidth id="transaction_id" label={t("Transaction Id")} variant="outlined" />
                <TextField type='text' name='PaymentMethod' value={addInput.PaymentMethod} onChange={handleForm} fullWidth id="payment_method" label={t("Payment Method")} variant="outlined" />
                <TextField type='text' name='Amount' value={addInput.Amount} onChange={handleForm} fullWidth id="amount" label={t("Amount")} variant="outlined" />
                <FormControl fullWidth>
                  <InputLabel>{t('Order Number')}</InputLabel>
                  <Select
                    value={addInput.OrderId}
                    onChange={handleForm}
                    name="OrderId"
                    required
                  >
                    {orders.map(order => (
                      <MenuItem key={order.id} value={order.id}>{order.order_number}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{t('Status')}</InputLabel>
                  <Select
                    value={addInput.Status}
                    onChange={handleForm}
                    name="Status"
                    required
                  >
                    <MenuItem value="success">{t("success")}</MenuItem>
                    <MenuItem value="pending">{t("pending")}</MenuItem>
                    <MenuItem value="failed">{t("failed")}</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid md={4}></Grid>
          <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
            <button
              onClick={handleDialogSubmit}
              disabled={btnIsDisabled}
              className={btnClasses} variant="contained" type="submit">{t('Create Transcation')}</button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
