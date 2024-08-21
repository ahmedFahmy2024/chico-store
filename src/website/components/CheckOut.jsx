import { useContext } from 'react';
import '../css/checkout.css'
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext'
import Form from './Form';

function CheckOut({ personalInfo, handleForm }) {
    const { locale } = useContext(LocalContext);
    const { t } = useTranslation();

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", 'checkout-page'].join(' ')}>
            <div>
                <div style={{ width: 'fit-content' }}>
                    <h3 style={{ textAlign: 'left', margin: '20px 0 0 0', paddingBottom: '10px', borderBottom: '1px solid black', fontWeight: 'bold' }}>{t('Billing Details')}</h3>
                </div>
                <hr style={{ border: '1px solid #eee', margin: '0 0 0 0' }} />
            </div>
            <Form personalInfo={personalInfo} handleForm={handleForm} />
        </div>
    )
}

export default CheckOut