import { useFilter } from '../context/FilterProvider';
import { LocalContext } from '../../context/LocalContext';
import { useContext } from 'react';
import Card1 from './Card1';
import Card2 from './Card2';
import '../css/product-list.css'

import Grid from '@mui/material/Unstable_Grid2';

function ProductList({ settings }) {
    const { locale } = useContext(LocalContext);
    const { filter_products } = useFilter();
    // console.log('filter_products', filter_products)
    // console.log('settings', settings)

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "product-list"].join(" ")}>
      {settings[7]?.value === '1' ?
        (
          <Grid container spacing={2}>
            {filter_products.map(product => (
              <Grid key={product.id} xs={6} md={4}>
                <Card1 { ...product }/>
              </Grid>
            ))}
          </Grid>
        )
        :
        (
          <div className="productsgrid">
            {filter_products.map(product => (
              <div key={product.id}>
                <Card2 { ...product } />
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

export default ProductList