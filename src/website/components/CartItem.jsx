import { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext'
import FormatPrice from '../helpers/FormatPrice';
import CartAmountToggle from './CartAmountToggle';
import "../css/cartitem.css"
import { useCart } from '../context/CartProvider';

import { Grid, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

function CartItem({ id, amount, nameEn, nameAr, image, salePrice, price }) {
    const { locale } = useContext(LocalContext);
    const { t } = useTranslation();
    const { handleRemove, setDecrease, setIncrease } = useCart()

    // Calculate the prices
    const basePrice = salePrice ? salePrice : price;
    const originalPrice = basePrice * amount;
    let finalPrice = originalPrice;

    if (amount === 2) {
        finalPrice = originalPrice * 0.9; // 10% discount
    } else if (amount >= 3) {
        finalPrice = originalPrice * 0.85; // 15% discount
    }

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "cartitem"].join(" ")}>
            <Grid className='function-grid' container spacing={2}>
                <Grid item xs={2}>
                    <img alt={id} src={image} className='cartImg' />
                </Grid>
                <Grid item xs={4}>
                    <p className='name-title'>{locale === 'en' ? nameEn : nameAr}</p>
                    <Stack direction="row" gap="5px" alignItems="center">
                        <p className='name-title'>{t("Price")}:</p>
                        <div className='sale-price'>
                            <FormatPrice price={salePrice} />
                        </div>
                        <div className='price'>
                            <FormatPrice price={price} />
                        </div>
                    </Stack>
                </Grid>
                <Grid item xs={2}>
                    <div className='sub-price'>
                        <FormatPrice price={finalPrice} />
                    </div>
                </Grid>
                <Grid item xs={2}>
                    <CartAmountToggle amount={amount} setDecrease={() => setDecrease(id)} setIncrease={() => setIncrease(id)} />
                </Grid>
                <Grid item sx={{ display: 'flex', justifyContent: 'center' }} xs={2}>
                    <IconButton onClick={() => handleRemove(id)} color="error" size="small" aria-label="delete">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    )
}

export default CartItem