import { Container } from '@mui/material';
import { Typography, Stack, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SettingsContent from '../components/SettingsContent';
import { LocalContext } from '../context/LocalContext';
import { useContext } from 'react';

export default function Settings() {
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);
    
    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "settingContent"].join(" ")}>
            <Container maxWidth="xl">
                <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: '20px' }}>
                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mb: '20px' }}>
                        {t('Settings')}
                    </Typography>
                </Stack>
                <SettingsContent />
            </Container>
        </div>
    )
}
