import { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext'
import "../css/cart.css"
import { NavLink } from "react-router-dom";
import OrderDetails from "../components/OrderDetails";
import CartFirstSec from "../components/CartFirstSec";
import MobileCart from '../components/MobileCart';
import { useCart } from "../context/CartProvider"
import { useCheckOut } from '../context/CheckOutProvider';
import { useMediaQuery } from 'react-responsive';
import CheckOut from '../components/CheckOut';

import { Container, Grid } from '@mui/material';

function Cart() {
  const { locale } = useContext(LocalContext);
  const { t } = useTranslation();
  const { cart, clearCart } = useCart()
  const { personalInfo, handleForm } = useCheckOut();
  // console.log("cart", cart)

  const isMobile = useMediaQuery({ maxWidth: 900 });
  const isDesktop = useMediaQuery({ minWidth: 901 });

  if (cart.length === 0) {
    return (
      <div dir={locale === "en" ? "ltr" : "rtl"} style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>{t("Your cart is empty")}!</h2>
        <NavLink to="/">
          <button style={{ marginTop: '20px', borderRadius: '5px', padding: '10px 20px', border: 'none', backgroundColor: 'black', color: 'white', cursor: 'pointer' }}>{t("Go Shopping")}</button>
        </NavLink>
      </div>
    )
  }

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "cart"].join(" ")}>
      <Container maxWidth="lg">

        {isDesktop && <CartFirstSec clearCart={clearCart} cart={cart} />}
        {isMobile && <MobileCart clearCart={clearCart} cart={cart} />}
        <Grid className='grid' container spacing={2}>
          <Grid item md={7} xs={12} sx={{ paddingTop: "0 !important" }}>
            <CheckOut personalInfo={personalInfo} handleForm={handleForm} />
          </Grid>
          <Grid item md={5} xs={12} sx={{ paddingTop: "0 !important" }}>
            <OrderDetails personalInfo={personalInfo} />
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Cart