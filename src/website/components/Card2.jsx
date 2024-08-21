import { LocalContext } from '../../context/LocalContext';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/card2.css'
import { useState } from 'react';
import { useCart } from '../context/CartProvider';
import ToastContext from '../../context/ToastProvider';
import { useTranslation } from 'react-i18next';

import { Icon } from '@iconify/react';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';

function Card2(props) {
    const { t } = useTranslation();
    const { showHideToast } = useContext(ToastContext);
    const { locale } = useContext(LocalContext);
    const theme = useTheme();
    const { id, Name_en, Name_ar, sale_price, price, images, Description_ar, Description_en } = props
    const image = images.split(',')[0];

    const [amount] = useState(1);
    const { addToCart } = useCart();

    const removeHTMLTags = (str) => {
        return str.replace(/<[^>]*>?/gm, '');
    };

    const handleAddToCart = (event) => {
        event.preventDefault();
        addToCart(id, amount, props);
        showHideToast(t("added successfully"));
    };

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "card2"].join(" ")}>
            <NavLink to={`/product/${id}`}>
                <div className='firstitem' style={{ display: 'flex', gap: '20px', alignItems: 'center', textAlign: 'left' }}>
                    <img className='item-image' decoding="async" src={image} alt="" />
                    <div className="item-content">
                        <h3 className='item-name' style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>{locale === 'en' ? Name_en : Name_ar}</h3>
                        <p className="item-description">{removeHTMLTags(locale === 'en' ? Description_en : Description_ar)}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }} className="sale-price">{sale_price} {locale === "en" ? "EGP" : "ج.م"}</span>
                                <span className="price">{price} {locale === "en" ? "EGP" : "ج.م"}</span>
                            </div>
                            <IconButton
                                onClick={handleAddToCart}
                                className='item-icon-btn'
                                aria-label="delete"
                                color="inherit">
                                <Icon className='item-icon' icon="solar:cart-large-4-linear" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </NavLink>
        </div>
    )
}

export default Card2