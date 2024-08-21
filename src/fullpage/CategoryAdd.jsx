import { useState, useContext } from 'react'
import { LocalContext } from '../context/LocalContext';
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Axios } from '../api/Axios';
import { CATEGORIES } from '../api/Api';
import '../css/categoryadd.css';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';


export default function ProductsAdd() {
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);

    //  ================ add state ================
    const [addInput, setAddInput] = useState({
        NameEN: '',
        NameAR: '',
        Visibility: false,
        Image: null,
        ImagePreview: null
    })
    //  ================ add state ================

    //  ================ add function ================

    function handleImageChange(event) {
        const imageFile = event.target.files[0];
        setAddInput({
            ...addInput,
            Image: imageFile,
            ImagePreview: URL.createObjectURL(imageFile) // Create object URL for preview
        });
    }

    function removeImage() {
        setAddInput({
            ...addInput,
            Image: null,
            ImagePreview: null
        });
    }

    async function handleDialogSubmit(e) {
        e.preventDefault();
        setLoading(true);
        let form = new FormData();
        form.append("Name_en", addInput.NameEN);
        form.append("Name_ar", addInput.NameAR);
        form.append("visibility", addInput.Visibility ? "1" : "0");
        if (addInput.Image !== null) { // Check if an image is selected
            form.append('image', addInput.Image);
        }
        try {
            const response = await Axios.post(`${CATEGORIES}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            showHideToast(t("Added successfully"));
            setAddInput({
                NameEN: '',
                NameAR: '',
                Visibility: '',
                Image: null,
                ImagePreview: null
            });
            setLoading(false);
            navigate("/dashboard/categories");
        } catch (error) {
            console.log(error);
            setLoading(false);
            showHideToast('Something went wrong, please try again', "error");
        }
    }
    //  ================ add function ================

    const btnIsDisabled = !addInput.NameEN || !addInput.NameAR || !addInput.Image || !addInput.Visibility

    let btnClasses = ""
    if (btnIsDisabled) {
        btnClasses = "disabled"
    } else {
        btnClasses = "submitbtn"
    }

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "categoryadd"].join(" ")}>
            <Container maxWidth="lg">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Create a new Category')}
                </h4>
                <Grid container spacing={2}>
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Title, short description, image...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <TextField autoFocus value={addInput.NameEN} onChange={(e) => { setAddInput({ ...addInput, NameEN: e.target.value }) }} fullWidth id="Name-EN" label={t("Category Name EN")} variant="outlined" />
                                <TextField value={addInput.NameAR} onChange={(e) => { setAddInput({ ...addInput, NameAR: e.target.value }) }} fullWidth id="Name-AR" label={t("Category Name AR")} variant="outlined" />

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
                                                        <img src={addInput.ImagePreview} alt="" />
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

                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Properties")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Additional functions and attributes..")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Grid container spacing={2}>
                                    <Grid xs={12} md={12}>
                                        <span>{t('Visibility')}</span>
                                        <Switch
                                            checked={addInput.Visibility}
                                            onChange={(e) => {
                                                setAddInput({ ...addInput, Visibility: e.target.checked })
                                            }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid md={4}></Grid>
                    <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
                        <button
                            onClick={handleDialogSubmit}
                            disabled={btnIsDisabled}
                            className={btnClasses} type="submit">{t('Create Category')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
