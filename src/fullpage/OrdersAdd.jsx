import { useState, useContext, useEffect } from 'react'
import { LocalContext } from '../context/LocalContext';
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Axios } from '../api/Axios';
import { ORDERS, baseUrl, PRODUCTS } from '../api/Api';
import '../css/ordersadd.css';

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

    //  ================ add state ================
    const [addInput, setAddInput] = useState({
        Status: '',
        AddressDetails: '',
        TotalOrderPrice: '',
        ShippingCost: '',
        Discount: '',
        FullName: '',
        Phone: '',
        Country: '',
        products: [{ ProductName: '', Quantity: '', UnitPrice: '', TotalPrice: '' }],
    })

    function handleform(e) {
        setAddInput({ ...addInput, [e.target.name]: e.target.value })
    }
    //  ================ add state ================

    //  ================ add function ================

    // Function to calculate total order price
    const calculateTotalOrderPrice = () => {
        const productsTotal = addInput.products.reduce((total, product) => {
            return total + parseFloat(product.TotalPrice || 0);
        }, 0);
        const shippingCost = parseFloat(addInput.ShippingCost || 0);
        const discount = parseFloat(addInput.Discount || 0);
        const totalOrderPrice = productsTotal + shippingCost - discount;

        setAddInput(prevState => ({
            ...prevState,
            TotalOrderPrice: totalOrderPrice.toFixed(2)
        }));
    };

    useEffect(() => {
        calculateTotalOrderPrice();
    }, [addInput.products, addInput.ShippingCost, addInput.Discount]);

    const handleProductNameChange = (event, index) => {
        const selectedProductId = event.target.value;
        const selectedProduct = apiproduct.find(product => product.id === selectedProductId);

        const updatedProducts = [...addInput.products];
        updatedProducts[index].ProductName = selectedProductId;
        updatedProducts[index].UnitPrice = (selectedProduct ? (selectedProduct.sale_price ? selectedProduct.sale_price : selectedProduct.price) : '');
        updatedProducts[index].TotalPrice = '';
        updatedProducts[index].Quantity = '';

        setAddInput({ ...addInput, products: updatedProducts });
    };

    const handleQuantityChange = (event, index) => {
        const updatedProducts = [...addInput.products];
        const quantity = parseFloat(event.target.value);
        const unitPrice = parseFloat(updatedProducts[index].UnitPrice);

        if (!isNaN(quantity) && !isNaN(unitPrice)) {
            updatedProducts[index].Quantity = quantity;
            updatedProducts[index].TotalPrice = (quantity * unitPrice).toFixed(2);
        } else {
            updatedProducts[index].Quantity = '';
            updatedProducts[index].TotalPrice = '';
        }

        setAddInput({ ...addInput, products: updatedProducts });
    };

    // Function to add a new product row
    const handleAddProduct = () => {
        setAddInput({
            ...addInput,
            products: [...addInput.products, { ProductName: '', Quantity: '', UnitPrice: '', TotalPrice: '' }],
        });
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...addInput.products];
        updatedProducts.splice(index, 1);
        setAddInput({ ...addInput, products: updatedProducts });
    };

    async function handleDialogSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const ProductsData = addInput.products.map(product => ({
            id: product.ProductName,
            quantity: product.Quantity,
        }));
        // console.log('ProductsData', ProductsData);
        const params = {
            status: addInput.Status,
            street: addInput.AddressDetails,
            total_order_price: addInput.TotalOrderPrice,
            products: ProductsData,
            country: addInput.Country,
            shipping_cost: addInput.ShippingCost,
            discount: addInput.Discount,
            full_name: addInput.FullName,
            phone: addInput.Phone,
        }
        // console.log(params);
        try {
            const response = await Axios.post(`${ORDERS}`, params)
            // console.log(response);
            showHideToast(t("Added successfully"));
            setAddInput({
                Status: '',
                AddressDetails: '',
                TotalOrderPrice: '',
                Country: '',
                products: [{ ProductName: '', Quantity: '' }],
            })
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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "ordersadd"].join(" ")}>
            <Container maxWidth="xl">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
                    {t('Create a new Order')}
                </h4>
                <Grid container spacing={2}>
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("ProductName, Quantity, Price...")}</p>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <div className="firstbox">
                            {addInput.products.map((product, index) => (
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
                                            <TextField sx={{ cursor: "not-allowed", userSelect: "none" }} disabled value={product.TotalPrice} fullWidth id="TotalPrice" label={t("Total Price")} variant="outlined" />
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
                                                value={addInput.Status}
                                                onChange={handleform}
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
                                        <TextField name='TotalOrderPrice' onChange={handleform} value={addInput.TotalOrderPrice} fullWidth id="total_order_price" label={t("Total Order Price")} variant="outlined" />
                                    </Grid>
                                    <Grid xs={12} md={6} lg={3}>
                                        <TextField name='ShippingCost' onChange={handleform} value={addInput.ShippingCost} fullWidth id="shipping_cost" label={t("Shipping Cost")} variant="outlined" />
                                    </Grid>
                                    <Grid xs={12} md={6} lg={3}>
                                        <TextField name='Discount' onChange={handleform} value={addInput.Discount} fullWidth id="discount" label={t("Discount")} variant="outlined" />
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
                                        <TextField name='FullName' onChange={handleform} value={addInput.FullName} fullWidth id="full_name" label={t("Full Name")} variant="outlined" />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <TextField fullWidth name='Phone' onChange={handleform} value={addInput.Phone} id="phone" label={t("Phone")} variant="outlined" />
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

                                    <Grid xs={12} md={6}>
                                        <FormControl fullWidth required sx={{ minWidth: 120 }} >
                                            <InputLabel id="demo-select-small-label">{t("Select Governorate")}</InputLabel>
                                            <Select
                                                className={[locale === 'en' ? 'ltr' : 'rtl', 'checkout-select'].join(' ')}
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                name='Country'
                                                value={addInput.Country}
                                                label={t("Select Governorate")}
                                                onChange={handleform}
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
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <TextField name='AddressDetails' onChange={handleform} value={addInput.AddressDetails} fullWidth id="AddressDetails" label={t("AddressDetails")} variant="outlined" />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Grid>

                </Grid>
                <Grid container spacing={2}>
                    <Grid md={4}></Grid>
                    <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
                        <button onClick={handleDialogSubmit} className='submitbtn' variant="contained" type="submit">{t('Create Order')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
