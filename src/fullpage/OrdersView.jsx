import React, { useState, useContext, useEffect, useMemo, useRef } from 'react'
import { LocalContext } from '../context/LocalContext';
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { Axios } from '../api/Axios';
import { ORDERS } from '../api/Api';
import { red, green, orange, blue } from '@mui/material/colors';

import '../css/ordersview.css';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Icon } from '@iconify/react';

export default function OrdersView() {
    const [order, setOrder] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const { id } = useParams()

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        setLoading(true);
        try {
            Axios.get(`${ORDERS}/${id}`)
                .then(function (response) {
                    // console.log(response.data.order)
                    setOrder(response.data.order)
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error)
                    setLoading(false);
                })
        } catch (error) {
            console.log(error)
            showHideToast('Something went wrong, please try again', 'error');
            setLoading(false);
        }
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    const amount = order?.products?.reduce((acc, product) => acc + product.pivot.quantity, 0);
    const price = order?.products?.reduce((acc, product) => acc + (product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.price)), 0);
    const totalPrice = price * amount
    // console.log("price", totalPrice)

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "ordersview"].join(" ")}>
            <Container maxWidth="lg">
                <div id="print-area">
                    <div className='header'>
                        <div className='title'>
                            {locale === "en" ? (
                                <IconButton className='back' aria-label="back" onClick={() => navigate(-1)}>
                                    <NavigateBeforeIcon sx={{ fontSize: '24px' }} />
                                </IconButton>
                            ) : (
                                <IconButton className='back' aria-label="back" onClick={() => navigate(-1)}>
                                    <NavigateNextIcon sx={{ fontSize: '24px' }} />
                                </IconButton>
                            )}

                            <div className='title-text'>
                                <div className='title-text-name'>
                                    <h4 style={{ fontSize: '1.5rem', margin: '0', fontWeight: 'bold' }}>{t("Order #")}{order.order_number}</h4>
                                    <span className='title-text-status'
                                        style={{
                                            backgroundColor: order.status === 'complete' ? green[100] : order.status === 'pending' ? orange[100] : order.status === 'failed' ? red[100] : blue[100],
                                            borderColor: order.status === 'complete' ? green[300] : order.status === 'pending' ? orange[300] : order.status === 'failed' ? red[300] : blue[300],
                                            color: order.status === 'complete' ? green[700] : order.status === 'pending' ? orange[700] : order.status === 'failed' ? red[700] : blue[700],
                                        }}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className='title-text-date'>{formatDate(order.created_at)}</p>
                            </div>
                            {/* <img style={{ width: '40px', height: '40px' }} className='logo' src={require('../assets/avatar_25.jpg')} alt="" /> */}
                        </div>
                        <div className='actions'>
                            <button className='print' onClick={handlePrint}>
                                <Icon icon="solar:printer-minimalistic-bold" width="20" height="20" />
                                <div>{t("Print")}</div>
                            </button>
                            <button className='edit' onClick={() => navigate(`/dashboard/orders/${id}/edit`)}>
                                <Icon icon="solar:pen-bold" width="20" height="20" />
                                <div>{t("Edit")}</div>
                            </button>
                        </div>
                    </div>
                    <Grid container spacing={2}>
                        <Grid xs={12} md={8}>
                            <div className='price'>
                                <div className='price-head'>
                                    <div className='price-head-details'>{t("Details")}</div>
                                </div>
                                <div className='price-body'>
                                    <div className='price-body-product'>
                                        {order.products && order.products.map((product) => (
                                            <div key={product.id} className='price-body-product-header'>
                                                <div className='price-body-product-header-image'>
                                                    <img src={product.images.split(',')[0]} alt="" />
                                                </div>
                                                <div className='price-body-product-header-name'>
                                                    <span className='price-body-product-header-name-text'>{locale === "en" ? product.Name_en : product.Name_ar}</span>
                                                </div>
                                                <div className='price-body-product-header-quantity'>x{product.pivot.quantity}</div>
                                                <div className='price-body-product-header-price'>{locale === "en" ? "EGP" : "ج.م"} {product.sale_price ? product.sale_price : product.price}</div>
                                            </div>
                                        ))}

                                        <div className='price-body-product-details'>
                                            <div className='price-body-product-details-row'>
                                                <div className='price-body-product-details-row-name'>{t("Subtotal")}</div>
                                                <div className='price-body-product-details-row-price'>{locale === "en" ? "EGP" : "ج.م"} {order?.total_order_price}</div>
                                            </div>
                                            <div className='price-body-product-details-row'>
                                                <div className='price-body-product-details-row-name'>{t("Shipping")}</div>
                                                <div className='price-body-product-details-row-shipping'>- {locale === "en" ? "EGP" : "ج.م"} {order.shipping_cost}</div>
                                            </div>
                                            <div className='price-body-product-details-row'>
                                                <div className='price-body-product-details-row-name'>{t("Discount")}</div>
                                                <div className='price-body-product-details-row-Discount'>- {locale === "en" ? "EGP" : "ج.م"} {Math.trunc(totalPrice - order?.total_order_price)}</div>
                                            </div>
                                            <div className='price-body-product-details-row-total'>
                                                <div className='price-body-product-details-row-name'>{t("Total")}</div>
                                                <div className='price-body-product-details-row-price'>{locale === "en" ? "EGP" : "ج.م"} {order?.total_order_price}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <div className='summary'>
                                <div>
                                    <div className='customer-info'>
                                        <div className='customer-info-text'>{t("Customer Info")}</div>
                                    </div>
                                    <div className='customer-info-details'>
                                        <div className='row'>
                                            <span className='row-label'>{t("Client Name")}:</span>
                                            <span>{order.full_name}</span>
                                        </div>
                                        <div className='row'>
                                            <span className='row-label'>{t("Phone")}:</span>
                                            <span>{order.phone}</span>
                                        </div>
                                    </div>
                                    <hr className='summary-hr' />
                                </div>
                                <div>
                                    <div className='customer-info asd'>
                                        <div className='customer-info-text'>{t("Shipping")}</div>
                                    </div>
                                    <div className='customer-info-details'>
                                        <div className='row'>
                                            <span className='row-label'>{t("Country")}:</span>
                                            <span>{order.country}</span>
                                        </div>
                                        <div className='row'>
                                            <span className='row-label'>{t("AddressDetails")}:</span>
                                            <span>{order.street}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>

    )
}
