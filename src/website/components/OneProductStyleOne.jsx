import React, { useContext } from 'react'
import { LocalContext } from '../../context/LocalContext';
import { useTranslation } from 'react-i18next';
import ImageSlider from './ImageSlider';
import FormatPrice from '../helpers/FormatPrice';
import RadioBtns from './RadioBtns';
import AddToCart from './AddToCart';

import Grid from '@mui/material/Unstable_Grid2';
import { Container, Stack } from "@mui/material";
import Rating from '@mui/material/Rating';
import { useTheme } from '@mui/material/styles';


const OneProductStyleOne = ({ product, originalPrice, finalPrice, amount, setAmount, setDecrease, setIncrease }) => {
  const { locale } = useContext(LocalContext);
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <div className={[locale === "en" ? "ltr" : "rtl", "oneProduct"].join(" ")}
      style={{
        backgroundColor: theme.palette.mode === "dark" ? "#0f0f0f" : "#f1f4fb",
      }}>
      <Container maxWidth="xl">
        <Grid className={[theme.palette.mode === 'dark' ? 'dark' : 'light', "first-grid"].join(" ")} container spacing={2}>
          <Grid xs={12} md={6}>
            <ImageSlider images={product?.images} />
          </Grid>
          <Grid className="white-container" xs={12} md={6}>
            <div>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: "35px 10px 0 0" }}>
                <div>
                  <h2 className="category-name" style={{ margin: '0 0 5px', textTransform: "capitalize" }}>{locale === "en" ? product?.category.Name_en : product?.category.Name_ar}</h2>
                  <h2 className="product-name" style={{ fontSize: "22px", fontWeight: "bold", margin: '0' }}>{locale === "en" ? product?.Name_en : product?.Name_ar}</h2>
                </div>
                <h4 style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span className={`spant ${finalPrice !== originalPrice ? 'no-discount' : ''}`}><FormatPrice price={originalPrice} /></span>
                  {finalPrice !== originalPrice && (
                    <span className="spant discount"><FormatPrice price={finalPrice} /></span>
                  )}
                </h4>
              </Stack>
              <span className="rating-container" style={{ fontSize: '15px', fontWeight: 500, color: '#9E9E9E', display: 'flex', alignItems: 'center' }}><Rating className="rating" sx={{ fontSize: '19px' }} name="read-only" value={4.5} precision={0.1} readOnly />(4.5)</span>
              <RadioBtns setAmount={setAmount} />
              <h2 className="description">{t('Description')}</h2>
              <div className="desc" dangerouslySetInnerHTML={{ __html: locale === "en" ? product?.Description_en : product?.Description_ar }} />
              <div className='available'>{t("Available")}:</div>
              <span className="stock-available">{product?.stock > 0 ? (t('In Stock')) : (t('Out of Stock'))}</span>

              <div className="desktop">
                {product?.stock > 0 && <AddToCart product={product} amount={amount} setAmount={setAmount} setDecrease={setDecrease} setIncrease={setIncrease} />}
              </div>

              <div className='mobile1' style={{ backgroundColor: theme.palette.mode === 'dark' ? '#0f0f0f' : '#f1f4fb' }}>
                <div className='add-to-cart-mobile'>
                  {product?.stock > 0 && <AddToCart product={product} amount={amount} setAmount={setAmount} setDecrease={setDecrease} setIncrease={setIncrease} />}
                </div>
              </div>

            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default OneProductStyleOne