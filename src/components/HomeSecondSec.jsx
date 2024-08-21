import { LocalContext } from '../context/LocalContext'
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
import { Icon } from '@iconify/react';

function HomeSecondSec({ charts }) {
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "homesecondsec"].join(" ")}>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={3} sx={{ padding: '12px' }}>
                    <Paper elevation={0} sx={{ display: 'flex', justifyContent: 'space-between', padding: '24px', borderRadius: '16px', boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px' }}>
                        <Stack direction={"column"} spacing={2}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{t('Total Products')}</div>
                            <Box sx={{ fontSize: "1.2rem", fontWeight: '700' }}>{charts?.totalProducts}</Box>
                        </Stack>
                        <Stack direction={"column"} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Icon style={{ width: '50px', height: '50px', color: '#22c55e' }} icon="solar:double-alt-arrow-up-bold-duotone" />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid xs={12} sm={6} md={3} sx={{ padding: '12px' }}>
                    <Paper elevation={0} sx={{ display: 'flex', justifyContent: 'space-between', padding: '24px', borderRadius: '16px', boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px' }}>
                        <Stack direction={"column"} spacing={2}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{t('Total Orders')}</div>
                            <Box sx={{ fontSize: "1.2rem", fontWeight: '700' }}>{charts?.totalOrders}</Box>
                        </Stack>
                        <Stack direction={"column"} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Icon style={{ width: '50px', height: '50px', color: '#22c55e' }} icon="solar:double-alt-arrow-up-bold-duotone" />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid xs={12} sm={6} md={3} sx={{ padding: '12px' }}>
                    <Paper elevation={0} sx={{ display: 'flex', justifyContent: 'space-between', padding: '24px', borderRadius: '16px', boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px' }}>
                        <Stack direction={"column"} spacing={2}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{t('Total Order Price')}</div>
                            <Box sx={{ fontSize: "1.2rem", fontWeight: '700' }}>{charts?.totalOrderPrice} {locale === "en" ? "EGP" : "ج.م"}</Box>
                        </Stack>
                        <Stack direction={"column"} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Icon style={{ width: '50px', height: '50px', color: '#22c55e' }} icon="solar:double-alt-arrow-up-bold-duotone" />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid xs={12} sm={6} md={3} sx={{ padding: '12px' }}>
                    <Paper elevation={0} sx={{ display: 'flex', justifyContent: 'space-between', padding: '24px', borderRadius: '16px', boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px' }}>
                        <Stack direction={"column"} spacing={2}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{t('Total Order Price Last Month')}</div>
                            <Box sx={{ fontSize: "1.2rem", fontWeight: '700' }}>{charts?.totalOrderPriceLastMonth} {locale === "en" ? "EGP" : "ج.م"}</Box>
                        </Stack>
                        <Stack direction={"column"} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Icon style={{ width: '50px', height: '50px', color: '#22c55e' }} icon="solar:double-alt-arrow-up-bold-duotone" />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default HomeSecondSec