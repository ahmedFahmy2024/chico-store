import { Container } from '@mui/material';
import React from 'react'
import Grid from '@mui/material/Unstable_Grid2';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

const OneStyleTwoFooter = () => {
    const { t } = useTranslation();

    return (
        <div className='footer-one-detail'>
            <Container maxWidth="lg">
                <h4 className='title'>{t("ليه تشتري من عندنا و انت مطمن ؟")}</h4>
                <div className="white-box">
                    <Grid container spacing={2}>
                        <Grid xs={12} md={6} lg={3}>
                            <div className="feat">
                                <Icon icon="hugeicons:wallet-done-02" width="42" height="42" />
                                <div>{t("الدفع عند الاستلام")}</div>
                            </div>
                        </Grid>
                        <Grid xs={12} md={6} lg={3}>
                            <div className="feat">
                                <Icon icon="hugeicons:truck-delivery" width="42" height="42" />
                                <div>{t("شحن مجاني")}</div>
                            </div>
                        </Grid>
                        <Grid xs={12} md={6} lg={3}>
                            <div className="feat">
                                <Icon icon="fluent:shield-task-20-regular" width="42" height="42" />
                                <div>{t("جودة 100%")}</div>
                            </div>
                        </Grid>
                        <Grid xs={12} md={6} lg={3}>
                            <div className="feat">
                                <Icon icon="bi:chat-square-dots" width="42" height="42" />
                                <div>{t("ارجاع مجاني")}</div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    )
}

export default OneStyleTwoFooter