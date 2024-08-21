import { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext'
import { useCart } from '../context/CartProvider';
import FormatPrice from '../helpers/FormatPrice';
import CheckOutFn from '../helpers/CheckOutFn';

import { Box, Typography } from '@mui/material';

function OrderDetails({ personalInfo }) {
    const { locale } = useContext(LocalContext);
    const { t } = useTranslation();
    const { handleCheckout } = CheckOutFn();
    const { total_price, shipping_fee } = useCart()

    const btnisdisabled = personalInfo.FullName === '' || personalInfo.Phone === '' || personalInfo.AddressDetails === '';

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "orderdetails"].join(" ")} >
            <Box sx={{ textAlign: "left", ml: { xs: 0, md: '20px' }, border: '2px solid #EEEEEE', borderRadius: '5px', p: 2, mt: { xs: 0, md: '30px' } }}>
                <Typography style={{ fontSize: "22px", fontWeight: "bold", marginTop: { xs: 0, md: "10px" }, marginBottom: { xs: 0, md: "10px" } }}>{t('Orders Details')}</Typography>
                <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h5 style={{ color: "#777", paddingBottom: "5px", marginBottom: "5px", marginTop: '10px' }}>{t('Subtotal')}:</h5>
                        <h5 style={{ color: "#777", paddingBottom: "5px", marginBottom: "5px", marginTop: '10px' }}>{t('Shipping Fee')}:</h5>
                        {/* <h5 style={{ color: "#777", paddingBottom: "5px", marginBottom: "5px", marginTop: '10px' }}>{t('Discount')}:</h5> */}
                        <h4 style={{}}>{t('Total')}:</h4>
                    </div>
                    <div>
                        <h5 style={{ color: "#777", paddingBottom: "5px", marginBottom: "5px", marginTop: '10px' }}>
                            <FormatPrice price={total_price} />
                        </h5>
                        <h5 style={{ color: "#777", paddingBottom: "5px", marginBottom: "5px", marginTop: '10px' }}>
                            <FormatPrice price={shipping_fee} />
                        </h5>
                        {/* <h5 style={{ color: "#777", paddingBottom: "5px", marginBottom: "5px", marginTop: '10px' }}>0</h5> */}
                        <h4 style={{}}>
                            <FormatPrice price={total_price + shipping_fee} />
                        </h4>
                    </div>
                </div>
                <button
                    sx={{ width: '100%' }}
                    onClick={handleCheckout}
                    className={btnisdisabled ? 'disabled' : 'normalButton'}
                    disabled={btnisdisabled}
                >{t('Confirm Order')}</button>
            </Box>
        </div>
    )
}

export default OrderDetails