import { useState, useContext, useEffect } from 'react'
import { LocalContext } from '../context/LocalContext';
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Axios } from '../api/Axios';
import { ORDERS, baseUrl, PRODUCTS } from '../api/Api';
import '../css/ordersedit.css';

import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function OrdersAdd() {
  const [apiproduct, setApiProduct] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  //  ================ edit state ================
  const [updateInput, setUpdateInput] = useState({
    Status: '',
    AddressDetails: '',
    TotalOrderPrice: '',
    Country: '',
    ShippingCost: '',
    Discount: '',
    FullName: '',
    Phone: '',
    products: [{ ProductName: '', Quantity: '', UnitPrice: '', TotalPrice: '' }],
  })

  function handleForm(e) {
    setUpdateInput({ ...updateInput, [e.target.name]: e.target.value })
  }
  //  ================ edit state ================

  //  ====== get all products ========
  useEffect(() => {
    setLoading(true);
    axios.get(`${baseUrl}${PRODUCTS}`,)
      .then(function (response) {
        // console.log('products ', response.data.products);
        setApiProduct(response.data.products);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast('Something went wrong, please try again', 'error');
        setLoading(false);
      }
      );
  }, []);
  //  ====== get all products ========

  //  ====== get specific order ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${ORDERS}/${id}`,)
      .then(function (response) {
        // console.log(response.data.order);
        const data = response.data.order;
        setUpdateInput({
          Status: data.status,
          AddressDetails: data.street,
          TotalOrderPrice: data.total_order_price,
          Country: data.country,
          ShippingCost: data.shipping_cost,
          Discount: data.discount,
          FullName: data.full_name,
          Phone: data.phone,
          products: data.products.map(product => ({
            ProductName: product.id,
            Quantity: product.pivot?.quantity,
            UnitPrice: product.sale_price ? product.sale_price : product.price,
            // TotalPrice: (product.pivot?.quantity) * (product.sale_price ? product.sale_price : product.price),
            TotalPrice: data.total_order_price
          })),
        })
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast('Something went wrong, please try again', 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get specific order ========

  //  ================ edit function ================

  const handleProductNameChange = (event, index) => {
    const selectedProductId = event.target.value;
    const selectedProduct = apiproduct.find(product => product.id === selectedProductId);

    const updatedProducts = [...updateInput.products];
    updatedProducts[index].ProductName = selectedProductId;
    updatedProducts[index].UnitPrice = (selectedProduct ? (selectedProduct.sale_price ? selectedProduct.sale_price : selectedProduct.price) : '');
    updatedProducts[index].TotalPrice = '';
    updatedProducts[index].Quantity = '';

    setUpdateInput({ ...updateInput, products: updatedProducts });
  };

  const handleQuantityChange = (event, index) => {
    const updatedProducts = [...updateInput.products];
    const quantity = parseFloat(event.target.value);
    const unitPrice = parseFloat(updatedProducts[index].UnitPrice);

    if (!isNaN(quantity) && !isNaN(unitPrice)) {
      updatedProducts[index].Quantity = quantity;
      updatedProducts[index].TotalPrice = (quantity * unitPrice).toFixed(2);
    } else {
      updatedProducts[index].Quantity = '';
      updatedProducts[index].TotalPrice = '';
    }

    setUpdateInput({ ...updateInput, products: updatedProducts });
  };


  // Function to add a new product row
  const handleAddProduct = () => {
    setUpdateInput({
      ...updateInput,
      products: [...updateInput.products, { ProductName: '', Quantity: '', UnitPrice: '', TotalPrice: '' }],
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...updateInput.products];
    updatedProducts.splice(index, 1);
    setUpdateInput({ ...updateInput, products: updatedProducts });
  };

  async function handleDialogSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const ProductsData = updateInput.products.map(product => ({
      id: product.ProductName,
      quantity: product.Quantity,
    }));
    const params = {
      status: updateInput.Status,
      street: updateInput.AddressDetails,
      total_order_price: updateInput.TotalOrderPrice,
      products: ProductsData,
      country: updateInput.Country,
      shipping_cost: updateInput.ShippingCost,
      discount: updateInput.Discount,
      full_name: updateInput.FullName,
      phone: updateInput.Phone,
    }
    // console.log(params);
    try {
      const response = await Axios.put(`${ORDERS}/${id}`, params)
      // console.log(response);
      showHideToast(t("Updated successfully"));
      setLoading(false);
      navigate("/dashboard/orders");
    } catch (error) {
      console.log(error);
      showHideToast('Something went wrong, please try again', 'error');
      setLoading(false);
    }
  }
  //  ================ add function ================

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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "ordersEdit"].join(" ")}>
      <Container maxWidth="xl">
        <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
          {t('Edit')}
        </h4>
        <Grid container spacing={2}>
          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("ProductName, Quantity, Price...")}</p>
          </Grid>
          <Grid xs={12} md={12}>
            <div className="firstbox">
              {updateInput.products.map((product, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6} lg={3}>
                      <FormControl fullWidth>
                        <InputLabel>{t('Product Name')}</InputLabel>
                        <Select
                          value={product.ProductName}
                          onChange={(e) => handleProductNameChange(e, index)}
                          name="Product Name"
                          required
                        >
                          {apiproduct.map((item) => (
                            <MenuItem key={item.id} value={item.id}>{locale === "en" ? item.Name_en : item.Name_ar}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={6} lg={3}>
                      <TextField value={product.Quantity} onChange={(e) => handleQuantityChange(e, index)} fullWidth id="Quantity" label={t("Quantity")} variant="outlined" />
                    </Grid>
                    <Grid xs={12} md={6} lg={2}>
                      <TextField sx={{ cursor: "not-allowed", userSelect: "none" }} disabled value={product.UnitPrice} fullWidth id="UnitPrice" label={t("Unit Price")} variant="outlined" />
                    </Grid>
                    <Grid xs={12} md={6} lg={2}>
                      <TextField sx={{ cursor: "not-allowed", userSelect: "none" }} disabled value={product.Quantity * product.UnitPrice} fullWidth id="TotalPrice" label={t("Total Price")} variant="outlined" />
                    </Grid>
                    <Grid xs={12} md={6} lg={2}>
                      <IconButton color="error" onClick={() => handleRemoveProduct(index)} aria-label="remove-room">
                        <ClearIcon />
                      </IconButton>
                      <IconButton color="primary" aria-label="add product" onClick={handleAddProduct}>
                        <AddIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </div>
              ))}
            </div>
          </Grid>

          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Properties")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Additional functions and attributes..")}</p>
          </Grid>
          <Grid xs={12} md={12}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6} lg={3}>
                    <FormControl fullWidth>
                      <InputLabel>{t('Status')}</InputLabel>
                      <Select
                        value={updateInput.Status}
                        onChange={handleForm}
                        name="Status"
                        required
                      >
                        <MenuItem value="complete">{t("completed")}</MenuItem>
                        <MenuItem value="pending">{t("pending")}</MenuItem>
                        <MenuItem value="failed">{t("failed")}</MenuItem>
                        <MenuItem value="processing">{t("processing")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={6} lg={3}>
                    <TextField sx={{ cursor: "not-allowed", userSelect: "none" }} disabled name='TotalOrderPrice' onChange={handleForm} value={updateInput.TotalOrderPrice} fullWidth id="total_order_price" label={t("Total Order Price")} variant="outlined" />
                  </Grid>
                  <Grid xs={12} md={6} lg={3}>
                    <TextField name='ShippingCost' onChange={handleForm} value={updateInput.ShippingCost} fullWidth id="shipping_cost" label={t("Shipping Cost")} variant="outlined" />
                  </Grid>
                  <Grid xs={12} md={6} lg={3}>
                    <TextField name='Discount' onChange={handleForm} value={updateInput.Discount} fullWidth id="discount" label={t("Discount")} variant="outlined" />
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>

          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Client Info")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Name, Email, Phone number...")}</p>
          </Grid>
          <Grid xs={12} md={12}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <TextField name='FullName' onChange={handleForm} value={updateInput.FullName} fullWidth id="full_name" label={t("Full Name")} variant="outlined" />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField fullWidth name='Phone' onChange={handleForm} value={updateInput.Phone} id="phone" label={t("Phone")} variant="outlined" />
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>

          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Shipping")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Address, Country...")}</p>
          </Grid>
          <Grid xs={12} md={12}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <Grid container spacing={2}>
                  {/* <Grid xs={12} md={6}>
                    <FormControl fullWidth required sx={{ minWidth: 120 }} >
                      <InputLabel id="demo-select-small-label">{t("Select Governorate")}</InputLabel>
                      <Select
                        className={[locale === 'en' ? 'ltr' : 'rtl', 'checkout-select'].join(' ')}
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        name='Country'
                        value={updateInput.Country}
                        label={t("Select Governorate")}
                        onChange={handleForm}
                      >
                        <MenuItem value="">{t('اختر محافظتك')}</MenuItem>
                        <MenuItem value="القاهرة">{t('Cairo')}</MenuItem>
                        <MenuItem value="الإسكندرية">{t('Alexandria')}</MenuItem>
                        <MenuItem value="البحيرة">{t('Beheira')}</MenuItem>
                        <MenuItem value="الفيوم">{t('Faiyum')}</MenuItem>
                        <MenuItem value="الغربية">{t('Gharbia')}</MenuItem>
                        <MenuItem value="الإسماعيلية">{t('Ismailia')}</MenuItem>
                        <MenuItem value="الجيزة">{t('Giza')}</MenuItem>
                        <MenuItem value="الدقهلية">{t('Dakahlia')}</MenuItem>
                        <MenuItem value="دمياط">{t('Damietta')}</MenuItem>
                        <MenuItem value="سوهاج">{t('Sohag')}</MenuItem>
                        <MenuItem value="السويس">{t('Suez')}</MenuItem>
                        <MenuItem value="الشرقية">{t('Sharqia')}</MenuItem>
                        <MenuItem value="شمال سيناء">{t('North Sinai')}</MenuItem>
                        <MenuItem value="الأقصر">{t('Luxor')}</MenuItem>
                        <MenuItem value="أسوان">{t('Aswan')}</MenuItem>
                        <MenuItem value="أسيوط">{t('Assiut')}</MenuItem>
                        <MenuItem value="بني سويف">{t('Beni Suef')}</MenuItem>
                        <MenuItem value="بورسعيد">{t('Port Said')}</MenuItem>
                        <MenuItem value="جنوب سيناء">{t('South Sinai')}</MenuItem>
                        <MenuItem value="القليوبية">{t('Qalyubia')}</MenuItem>
                        <MenuItem value="قنا">{t('Qena')}</MenuItem>
                        <MenuItem value="كفر الشيخ">{t('Kafr El Sheikh')}</MenuItem>
                        <MenuItem value="المنوفية">{t('Monufia')}</MenuItem>
                        <MenuItem value="المنيا">{t('Minya')}</MenuItem>
                        <MenuItem value="الوادي الجديد">{t('New Valley')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}
                  <Grid xs={12} md={6}>
                    <TextField name='AddressDetails' onChange={handleForm} value={updateInput.AddressDetails} fullWidth id="AddressDetails" label={t("AddressDetails")} variant="outlined" />
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>

        </Grid>
        <Grid container spacing={2}>
          <Grid md={4}></Grid>
          <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
            <button onClick={handleDialogSubmit} className='submitbtn' variant="contained" type="submit">{t('Edit Order')}</button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
