import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext'

import TextField from '@mui/material/TextField';

function Form({ personalInfo, handleForm }) {
    const { locale } = useContext(LocalContext);
    const { t } = useTranslation();

    return (
        <div className={[locale === 'en' ? 'ltr' : 'rtl', 'checkout-form'].join(' ')} style={{ marginTop: '20px' }}>
            <form className='form'>
                <TextField required fullWidth value={personalInfo.FullName} onChange={handleForm} size="small" name='FullName' label={t("FullName")} variant="outlined" />
                <TextField required fullWidth value={personalInfo.Phone} onChange={handleForm} size="small" name='Phone' label={t("Phone")} variant="outlined" />
                <TextField required fullWidth value={personalInfo.AddressDetails} onChange={handleForm} size="small" name='AddressDetails' label={t("Address With Details")} multiline rows={4} />
            </form>
        </div>
    )
}

export default Form