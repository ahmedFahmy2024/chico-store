import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from '@iconify/react/dist/iconify.js';

import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../context/LocalContext';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Axios } from '../api/Axios';
import { baseUrl, SETTINGS } from '../api/Api';

import '../css/settingcontent.css';

export default function SettingsContent() {
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const [loading, setLoading] = useState(false);

    const [addInput, setAddInput] = useState({
        Image: null,
        ImagePreview: null,
    })
    const [addInput2, setAddInput2] = useState({
        BannerImage: null,
        BannerImagePreview: null
    })
    const [Title, setTitle] = useState('');
    const [DescriptionEn, setDescriptionEn] = useState('');
    const [DescriptionAr, setDescriptionAr] = useState('');
    const [DeliveryEn, setDeliveryEn] = useState('');
    const [DeliveryAr, setDeliveryAr] = useState('');
    const [ProductsView, setProductsView] = useState('');
    const [CategoryView, setCategoryView] = useState('');

    const [pixel, setPixel] = useState({
        whatsapp: '',
        instagram: '',
        facebook: '',
        tiktok: '',
        google: '',
    });

    //  ====== get all data ========
    useEffect(() => {
        setLoading(true);
        axios.get(`${baseUrl}${SETTINGS}`,)
            .then(function (response) {
                // console.log(response);
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setAddInput({
                    ...addInput,
                    ImagePreview: response.data[0].value,
                    Image: response.data[0].value,
                })
                setAddInput2({
                    ...addInput2,
                    BannerImagePreview: response.data[3].value,
                    BannerImage: response.data[3].value
                })
                setTitle(response.data[1].value);
                setDescriptionAr(response.data[2].value);
                setDeliveryAr(response.data[4].value);
                setDeliveryEn(response.data[5].value);
                setCategoryView(response.data[6].value);
                setProductsView(response.data[7].value);
                setDescriptionEn(response.data[8].value);
                setPixel({
                    ...pixel,
                    whatsapp: response.data[9].value,
                    instagram: response.data[10].value,
                    facebook: response.data[11].value,
                    tiktok: response.data[12].value,
                    google: response.data[13].value
                })
            } else {
                showHideToast('Unexpected API response format', 'error');
            }
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast(error.response?.data?.message || 'Error fetching data', 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get all data ========

    function handleImageChange(event) {
        const imageFile = event.target.files[0];
        setAddInput({
            ...addInput,
            Image: imageFile,
            ImagePreview: URL.createObjectURL(imageFile), // Create object URL for preview
        });
    }

    function removeImage() {
        setAddInput({
            ...addInput,
            Image: null,
            ImagePreview: null,
        });
    }

    function handleImageChange2(event) {
        const imageFiles = event.target.files[0];
        setAddInput2({
            ...addInput2,
            BannerImage: imageFiles,
            BannerImagePreview: URL.createObjectURL(imageFiles) // Create object URL for preview
        });
    }

    function removeImage2() {
        setAddInput2({
            ...addInput2,
            BannerImage: null,
            BannerImagePreview: null
        });
    }

    //  ================ edit function ================

    async function handleEditSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const requests = [];

        let Logoform = new FormData();
        Logoform.append('_method', 'PUT');
        if (addInput.Image !== null) {
            Logoform.append('value', addInput.Image);
        }
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/logo`, Logoform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let Bannerform = new FormData();
        Bannerform.append('_method', 'PUT');
        if (addInput2.BannerImage !== null) {
            Bannerform.append('value', addInput2.BannerImage);
        }
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/banner`, Bannerform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let Titleform = new FormData();
        Titleform.append('_method', 'PUT');
        Titleform.append("value", Title);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/title`, Titleform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let DescriptionEnform = new FormData();
        DescriptionEnform.append('_method', 'PUT');
        DescriptionEnform.append("value", DescriptionEn);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/description_en`, DescriptionEnform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let DescriptionArform = new FormData();
        DescriptionArform.append('_method', 'PUT');
        DescriptionArform.append("value", DescriptionAr);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/description_ar`, DescriptionArform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let DeliveryEnform = new FormData();
        DeliveryEnform.append('_method', 'PUT');
        DeliveryEnform.append("value", DeliveryEn);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/deliverytime_en`, DeliveryEnform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let DeliveryArform = new FormData();
        DeliveryArform.append('_method', 'PUT');
        DeliveryArform.append("value", DeliveryAr);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/deliverytime_ar`, DeliveryArform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let CategoryViewform = new FormData();
        CategoryViewform.append('_method', 'PUT');
        CategoryViewform.append('value', CategoryView);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/cate_style`, CategoryViewform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let ProductsViewform = new FormData();
        ProductsViewform.append('_method', 'PUT');
        ProductsViewform.append('value', ProductsView);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/product_style`, ProductsViewform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let whatsappform = new FormData();
        whatsappform.append('_method', 'PUT');
        whatsappform.append("value", pixel.whatsapp);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/whatsapp`, whatsappform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let instagramform = new FormData();
        instagramform.append('_method', 'PUT');
        instagramform.append("value", pixel.instagram);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/instagram`, instagramform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let facebookform = new FormData();
        facebookform.append('_method', 'PUT');
        facebookform.append("value", pixel.facebook);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/facebook_pixel`, facebookform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let tiktokform = new FormData();
        tiktokform.append('_method', 'PUT');
        tiktokform.append("value", pixel.tiktok);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/tiktok_pixel`, tiktokform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        let googleform = new FormData();
        googleform.append('_method', 'PUT');
        googleform.append("value", pixel.google);
        try {
            requests.push(
                await Axios.post(`${SETTINGS}/google_analytics_id`, googleform, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            );
        } catch (error) {
            console.log(error);
        }

        Promise.all(requests)
            .then(function (responses) {
                responses.forEach(response => {
                    if (response.config.url === "https://store.pharmaco-medica.com/api/settings/title") {
                        setTitle(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/description_en") {
                        setDescriptionEn(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/description_ar") {
                        setDescriptionAr(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/deliverytime_ar") {
                        setDeliveryAr(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/deliverytime_en") {
                        setDeliveryEn(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/cate_style") {
                        setCategoryView(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/product_style") {
                        setProductsView(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/logo") {
                        setAddInput.Image(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/banner") {
                        setAddInput2.BannerImage(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/whatsapp") {
                        setPixel.whatsapp(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/instagram") {
                        setPixel.instagram(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/facebook_pixel") {
                        setPixel.facebook(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/tiktok_pixel") {
                        setPixel.tiktok(response.data.value);
                    } else if (response.config.url === "https://store.pharmaco-medica.com/api/settings/google_analytics_id") {
                        setPixel.google(response.data.value);
                    }
                });
                setLoading(false);
                // console.log('responses1', responses);
                showHideToast(t("Updated successfully"));
            })
            .catch(function (error) {
                console.log(error);
                showHideToast('Something went wrong, please try again', 'error');
                setLoading(false);
            })
    }
    //  ================ edit function ================

    // ================= loading =================
    if (loading) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "settingContent"].join(" ")}>
            <Grid container spacing={2}>
                <Grid xs={12} md={7}>
                    <div className="firstbox">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                            <TextField autoFocus name='Title' value={Title} onChange={(e) => setTitle(e.target.value)} fullWidth id="title" label={t("Title")} variant="outlined" />
                            <TextField name='DescriptionEn' value={DescriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} fullWidth id="description_en" label={t("Description En")} variant="outlined" />
                            <TextField name='DescriptionAr' value={DescriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} fullWidth id="description_ar" label={t("Description Ar")} variant="outlined" />
                            <TextField name='DeliveryEn' value={DeliveryEn} onChange={(e) => setDeliveryEn(e.target.value)} fullWidth id="deliverytime_en" label={t("Delivery En")} variant="outlined" />
                            <TextField name='DeliveryAr' value={DeliveryAr} onChange={(e) => setDeliveryAr(e.target.value)} fullWidth id="deliverytime_ar" label={t("Delivery Ar")} variant="outlined" />
                        </div>
                    </div>
                </Grid>
                {/* <Grid xs={12} md={7}>
                    <div className="firstbox">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                            <TextField value={pixel.whatsapp} onChange={(e) => setPixel({ ...pixel, whatsapp: e.target.value })} fullWidth label={t("whatsapp")} variant="outlined" />
                            <TextField value={pixel.instagram} onChange={(e) => setPixel({ ...pixel, instagram: e.target.value })} fullWidth label={t("instagram")} variant="outlined" />
                            <TextField value={pixel.facebook} onChange={(e) => setPixel({ ...pixel, facebook: e.target.value })} fullWidth label={t("facebook")} variant="outlined" />
                            <TextField value={pixel.tiktok} onChange={(e) => setPixel({ ...pixel, tiktok: e.target.value })} fullWidth label={t("tiktok")} variant="outlined" />
                            <TextField value={pixel.google} onChange={(e) => setPixel({ ...pixel, google: e.target.value })} fullWidth label={t("google")} variant="outlined" />
                        </div>
                    </div>
                </Grid> */}
                <Grid xs={12} md={7}>
                    <div className="firstbox">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '24px' }}>
                            <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Products View")}</h6>
                            <div className="radio-buttons">
                                <label className="custom-radio">
                                    <input value="1" checked={ProductsView === "1"} onChange={(e) => setProductsView(e.target.value)} type="radio" name="radioone" />
                                    <span className="radio-btn"><Icon icon="solar:check-circle-outline" width="26" height="26" />
                                        <div className="hobbies-icon">
                                            <img alt='' src={require('../assets/menu.png')} />
                                            <h3 className="">{t("Style One")}</h3>
                                        </div>
                                    </span>
                                </label>
                                <label className="custom-radio">
                                    <input value="2" checked={ProductsView === "2"} onChange={(e) => setProductsView(e.target.value)} type="radio" name="radiotwo" />
                                    <span className="radio-btn"><Icon icon="solar:check-circle-outline" width="26" height="26" />
                                        <div className="hobbies-icon">
                                            <img alt='' src={require('../assets/row.png')} />
                                            <h3 className="">{t("Style Two")}</h3>
                                        </div>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} md={7}>
                    <div className="firstbox">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '24px' }}>
                            <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Category View")}</h6>
                            <div className="radio-buttons">
                                <label className="custom-radio">
                                    <input value="1" checked={CategoryView === "1"} onChange={(e) => setCategoryView(e.target.value)} type="radio" name="radiothree" />
                                    <span className="radio-btn"><Icon icon="solar:check-circle-outline" width="26" height="26" />
                                        <div className="hobbies-icon">
                                            <img alt='' src="https://img.freepik.com/free-vector/sport-equipment-concept_1284-13034.jpg?size=626&ext=jpg" />
                                            <h3 className="">{t("Style One")}</h3>
                                        </div>
                                    </span>
                                </label>
                                <label className="custom-radio">
                                    <input value="2" checked={CategoryView === "2"} onChange={(e) => setCategoryView(e.target.value)} type="radio" name="radiofour" />
                                    <span className="radio-btn"><Icon icon="solar:check-circle-outline" width="26" height="26" />
                                        <div className="hobbies-icon">
                                            <img alt='' src="https://img.freepik.com/free-vector/hand-drawn-flat-design-poetry-illustration_23-2149279810.jpg?size=626&ext=jpg" />
                                            <h3 className="">{t("Style Two")}</h3>
                                        </div>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} md={7}>
                    <div className="firstbox">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Images")}</h6>
                                <div style={{ width: '100%', position: 'relative' }}>
                                    <div className='images' onClick={() => document.querySelector('.input-field').click()}>
                                        <input onChange={handleImageChange} className='input-field' style={{ display: 'none' }} accept="image/*" type="file" />
                                        <div className='image'>
                                            <CloudUploadIcon sx={{ fontSize: '150px', color: '#212b36' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
                                                <h6 style={{ fontSize: '1.125rem', margin: '0', fontWeight: 700 }}>{t("Drop or Select file")}</h6>
                                                <p className='para'>
                                                    {t("Drop files here or click")}
                                                    <span className='browse'>{t("browse")}</span>
                                                    {t("thorough your machine")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ margin: '24px 0 24px 0' }}>
                                        {addInput.ImagePreview && (
                                            <div className='preview'>
                                                <span className='prev-image'>
                                                    <img style={{ objectFit: 'cover', aspectRatio: '1/1' }} src={addInput.ImagePreview} alt="" />
                                                    <button className='close' onClick={() => removeImage()}>
                                                        <CloseIcon sx={{ fontSize: '14px', color: 'white' }} />
                                                    </button>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} md={7}>
                    <div className="firstbox">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Banner Image")}</h6>
                                <div style={{ width: '100%', position: 'relative' }}>
                                    <div className='images' onClick={() => document.querySelector('.input-field2').click()}>
                                        <input onChange={handleImageChange2} className='input-field2' style={{ display: 'none' }} accept="image/*" type="file" />
                                        <div className='image'>
                                            <CloudUploadIcon sx={{ fontSize: '150px', color: '#212b36' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
                                                <h6 style={{ fontSize: '1.125rem', margin: '0', fontWeight: 700 }}>{t("Drop or Select file")}</h6>
                                                <p className='para'>
                                                    {t("Drop files here or click")}
                                                    <span className='browse'>{t("browse")}</span>
                                                    {t("thorough your machine")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ margin: '24px 0 24px 0' }}>
                                        {addInput2.BannerImagePreview && (
                                            <div className='preview'>
                                                <span className='prev-image'>
                                                    <img style={{ objectFit: 'cover', aspectRatio: '1/1' }} src={addInput2.BannerImagePreview} alt="" />
                                                    <button className='close' onClick={() => removeImage2()}>
                                                        <CloseIcon sx={{ fontSize: '14px', color: 'white' }} />
                                                    </button>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid md={4}></Grid>
                <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={handleEditSubmit} className='submitbtn' variant="contained" type="submit">{t('Save Changes')}</button>
                </Grid>
            </Grid>
        </div>
    )
}
