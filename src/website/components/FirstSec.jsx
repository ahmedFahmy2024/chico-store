import React from 'react'
import { LocalContext } from '../../context/LocalContext';
import { useContext } from 'react';
import '../css/firstsec.css'

import { Box, Stack } from '@mui/material';

function FirstSec({ settings }) {
    const { locale } = useContext(LocalContext);
  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "firstSec"].join(" ")}>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ justifyContent: 'flex-start', }}>
        <Box sx={{ maxWidth: 100 }}>
          <img
            style={{ height: 100, borderRadius: '5px' }}
            src={settings[0]?.value}
            alt="Company logo"
          />
        </Box>
        <div style={{ textAlign: locale === "en" ? 'left' : 'right', marginLeft: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{settings[1]?.value}</div>
          <div style={{ fontSize: '14px', color: '#777', fontWeight: 400, margin: '5px 0' }}>{locale === "en" ? settings[8]?.value : settings[2]?.value}</div>
          <img style={{ maxWidth: '240px' }} src={require('../../assets/commercial-ezgif.com-jpg-to-png-converter.jpg')} alt="" />
        </div>
      </Stack>

    </div>
  )
}

export default FirstSec