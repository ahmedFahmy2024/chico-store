import { LocalContext } from '../../context/LocalContext';
import { RefContext } from '../context/RefContext';
import { useContext, useState } from 'react';
import '../css/card1.css'
import { useCart } from '../context/CartProvider';
import ToastContext from '../../context/ToastProvider';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

function Card1(props) {
    const { showHideToast } = useContext(ToastContext);
    const { t } = useTranslation();
    const { locale } = useContext(LocalContext);
    const { productListRef } = useContext(RefContext);
    const theme = useTheme();
    const { id, Name_en, Name_ar, sale_price, price, images } = props
    const image = images.split(',')[0];
  
    // console.log('props', props)
  
    const [amount] = useState(1);
    const { addToCart } = useCart();
  
    const handleAddToCart = () => {
      addToCart(id, amount, props);
      showHideToast(t("added successfully"));
    };

    const handleProductClick = (e) => {
      e.preventDefault();
      window.location.href = `/product/${id}`;
    };

  return (
    <div ref={productListRef} dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "card1"].join(" ")}>
      <div style={{ cursor: "pointer" }} onClick={handleProductClick}>
        <img decoding="async" src={image} alt="" />
        <div className="content">
          <h3 style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>{locale === 'en' ? Name_en : Name_ar}</h3>
          <Stack direction="row" spacing={1} alignItems="center">
            <span style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }} className='sale-price'>{sale_price} {locale === "en" ? "EGP" : "ج.م"}</span>
            <span className="old-price">{price} {locale === "en" ? "EGP" : "ج.م"}</span>
          </Stack>
        </div>
      </div>
      <div className="info">
        <button
          onClick={handleAddToCart}
          size='small'
          className='add-to-cart'
          variant="outlined"
        >
          {t("Add To Cart")}
        </button>
      </div>
    </div>
  )
}

export default Card1