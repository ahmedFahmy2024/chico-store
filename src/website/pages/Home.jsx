import { useContext } from 'react';
import { LocalContext } from '../../context/LocalContext';
import FirstSec from '../components/FirstSec';
import ProductList from '../components/ProductList';
import CatNav from '../components/CatNav';
import CatText from '../components/CatText';
import '../css/home.css';
import { useProduct } from '../context/ProductProvider';
import { useSettings } from '../context/SettingsProvider';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';


function Home() {
  const { isLoading, categories } = useProduct();
  const { isSetLoading, settings } = useSettings();
  const { locale } = useContext(LocalContext);

  if (isLoading || isSetLoading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    )
  }

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "home"].join(" ")}>
      {/* <Container maxWidth="xl"> */}
        <Grid container spacing={2}>

          <Grid xs={12} md={6} className='firstOne'>
            <FirstSec settings={settings} />
            {settings[6]?.value ? (settings[6]?.value === '1' ? <CatNav categories={categories} settings={settings} /> : <CatText categories={categories} />) : null}
            <Container maxWidth="xl">
            <ProductList settings={settings} />
            </Container>
          </Grid>

          <Grid xs={12} md={6} className='secondOne'>
            <div style={{ width: '100%', position: 'sticky', top: 0, right: 0, height: '100vh' }}>
              <img src={settings[3]?.value} alt="hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Grid>

        </Grid>
      {/* </Container> */}
    </div>
  )
}

export default Home