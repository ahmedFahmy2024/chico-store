import { useCart } from '../context/CartProvider';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext'
import '../css/mobileCart.css'
import FormatPrice from '../helpers/FormatPrice';
import CartAmountToggle from './CartAmountToggle';
import { NavLink } from 'react-router-dom';

import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function MobileCart({ clearCart, cart }) {
    const { locale } = useContext(LocalContext);
    const { t } = useTranslation();
    const { handleRemove, setDecrease, setIncrease } = useCart()

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "mobileCart"].join(" ")} style={{ marginTop: "40px" }}>
            {cart?.map((product, index) => {
                const { id, amount, nameEn, nameAr, image, salePrice, price } = product
                return (
                    <div key={index} className='cartContainer' style={{ display: 'flex', gap: '20px', alignItems: 'center', textAlign: 'left', }}>
                        <img className='item-image' decoding="async" src={image} alt="" />
                        <div className="item-content">
                            <h3 className='item-name'>{locale === 'en' ? nameEn : nameAr}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="sale-price">
                                    <FormatPrice price={salePrice} />
                                </span>
                                <span className="price">
                                    <FormatPrice price={price} />
                                </span>
                            </div>
                            <Stack direction="row" gap="5px" alignItems="center" justifyContent="space-between" sx={{ marginTop: "10px" }}>
                                <CartAmountToggle amount={amount} setDecrease={() => setDecrease(id)} setIncrease={() => setIncrease(id)} />
                                <IconButton onClick={() => handleRemove(id)} color="error" size="small" aria-label="delete">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </div>
                    </div>
                )
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

export default MobileCart