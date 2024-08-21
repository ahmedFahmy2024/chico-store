import { useContext } from 'react'
import { LocalContext } from '../../context/LocalContext';
import { useTranslation } from 'react-i18next';
import "../css/thanks.css"
import success from '../../assets/success-icon.png'
import { Link } from 'react-router-dom';
import RelatedProducts from '../components/RelatedProducts';
import Container from '@mui/material/Container';

function Thanks() {
  const { locale } = useContext(LocalContext);
  const { t } = useTranslation();

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "thanks"].join(" ")}>
      <Container maxWidth="lg">
        <div className="thank-content">
          <img src={success} alt="success" style={{ width: '50px', height: 'auto' }} />
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '20px' }}>{t("Thanks")}</h1>
          <p style={{ fontSize: '10px', marginTop: '10px' }}>{t("We will contact you soon")}</p>
          <p style={{ fontSize: '10px', marginTop: '10px' }}>{t("Have a nice day")}</p>
          <p style={{ fontSize: '10px', marginTop: '10px' }}>{t("Chico Store | متجر شيكو")}</p>
          <Link to="/">
            <button className='btn'>{t("Go to shopping")}</button>
          </Link>
        </div>
        <div className="related-Products-parent">
          <RelatedProducts />
        </div>
      </Container>
    </div>
  )
}

export default Thanks