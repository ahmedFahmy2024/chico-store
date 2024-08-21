import { useState, useContext } from 'react'
import ToastContext from '../../context/ToastProvider'
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext'
import CartAmountToggle from './CartAmountToggle'

import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartProvider';

function AddToCart({ product, amount, setAmount, setDecrease, setIncrease }) {
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  const { showHideToast } = useContext(ToastContext);

  const { id, stock } = product || ""

  const { addToCart } = useCart();

  // console.log('product', product)

  const handleAddToCart = () => {
    addToCart(id, amount, product);
    showHideToast(t("added successfully"));
  };
  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "addtocart"].join(" ")}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <CartAmountToggle amount={amount} setDecrease={setDecrease} setIncrease={setIncrease} setAmount={setAmount} />

        <NavLink to={`/cart`} style={{ textDecoration: "none", display: "contents" }}>
          <Button className="add-to-cart" variant="contained" onClick={handleAddToCart}>
            <Icon icon="solar:cart-large-4-linear" width="20" height="20" />
            {t("add to cart")}
          </Button>
        </NavLink>

      </div>
    </div>
  )
}

export default AddToCart