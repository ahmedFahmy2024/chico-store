import { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext'
import "../css/cartfirstsec.css"
import CartItem from "../components/CartItem";
import { NavLink } from "react-router-dom";
import { Grid } from '@mui/material';

function CartFirstSec({ clearCart, cart }) {
    const { locale } = useContext(LocalContext);
    const { t } = useTranslation();

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "cartfirstsec"].join(" ")}>
            <Grid className='text-main-grid' container sx={{ textAlign: "left" }}>
                <Grid item className='text-sec-grid' xs={2}>
                    <h5>{t('Products')}</h5>
                </Grid>
                <Grid item className='text-sec-grid' xs={4}>
                    <h5>{t('Title')}</h5>
                </Grid>
                <Grid item className='text-sec-grid' xs={2}>
                    <h5 style={{ textAlign: "center" }}>{t('subTotal')}</h5>
                </Grid>
                <Grid item className='text-sec-grid' xs={2}>
                    <h5 style={{ textAlign: "center" }}>{t('Quantity')}</h5>
                </Grid>
                <Grid item className='text-sec-grid' xs={2}>
                    <h5 style={{ textAlign: "center" }}>{t('Remove')}</h5>
                </Grid>
            </Grid>

            <hr style={{ margin: "0 0 10px 0", backgroundColor: "#ccc", height: "2px", border: "none" }} />

            {cart?.map((item, index) => {
                return <CartItem key={index} {...item} />
            })}

            <div className="stack">
                <NavLink to="/" style={{ textDecoration: "none", display: "contents" }}>
                    <button style={{ borderRadius: '5px', padding: '10px 20px', border: 'none', backgroundColor: 'black', color: 'white', cursor: 'pointer' }}>{t('Continue Shopping')}</button>
                </NavLink>
                <button onClick={clearCart} style={{ borderRadius: '5px', padding: '10px 20px', border: 'none', backgroundColor: '#d32f2f', color: 'white', cursor: 'pointer' }}>{t("Clear Cart")}</button>
            </div>
        </div>
    )
}

export default CartFirstSec