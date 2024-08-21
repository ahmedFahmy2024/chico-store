import { useState, useContext, useEffect } from 'react'
import { LocalContext } from '../context/LocalContext';
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Axios } from '../api/Axios';
import { CATEGORIES } from '../api/Api';
import '../css/categoryedit.css';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

export default function CategoryEdit() {
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    //  ================ edit state ================
    const [updateInput, setUpdateInput] = useState({
        NameAr: '',
        NameEn: '',
        Visibility: false,
        Image: null,
        ImagePreview: null
    })

    function handleForm(e) {
        setUpdateInput({ ...updateInput, [e.target.name]: e.target.value })
    }
    //  ================ edit state ================

    //  ====== get specific category ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${CATEGORIES}/${id}`,)
            .then(function (response) {
                // console.log(response.data.category);
                const data = response.data.category;
                setUpdateInput({
                    NameAr: data.Name_ar,
                    NameEn: data.Name_en,
                    Visibility: data.visibility,
                    ImagePreview: data.image
                })
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast('Something went wrong, please try again', 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get specific category ========


    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        const imagePreviewURL = URL.createObjectURL(imageFile);
        setUpdateInput({
            ...updateInput,
            Image: imageFile,
            ImagePreview: imagePreviewURL
        });
    };

    const removeImage = () => {
        setUpdateInput({
            ...updateInput,
            Image: null,
            ImagePreview: null
        });
    }

    async function handleEditSubmit(e) {
        e.preventDefault();
        setLoading(true);

        let form = new FormData();
        form.append('_method', 'PUT');
        form.append("Name_en", updateInput.NameEn);
        form.append("Name_ar", updateInput.NameAr);
        form.append("visibility", updateInput.Visibility ? "1" : "0");
        if (updateInput.Image !== null) {
            form.append('image', updateInput.Image);
        }

        try {
            const response = await Axios.post(`${CATEGORIES}/${id}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setLoading(false);
            showHideToast(t("Updated successfully"));
            navigate("/dashboard/categories");
        } catch (error) {
            console.log(error);
            setLoading(false);
            showHideToast('Something went wrong, please try again', "error");
        }
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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "categoryEdit"].join(" ")}>
            <Container maxWidth="lg">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Edit')}
                </h4>
                <Grid container spacing={2}>
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{("Details")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Title, short description, image...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <TextField value={updateInput.NameEn} onChange={handleForm} name="NameEn" fullWidth label={t("Category Name EN")} variant="outlined" />
                                <TextField value={updateInput.NameAr} onChange={handleForm} name="NameAr" fullWidth label={t("Category Name AR")} variant="outlined" />

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
                                            {updateInput.ImagePreview && (
                                                <div className='preview'>
                                                    <span className='prev-image'>
                                                        <img src={updateInput.ImagePreview} alt="" />
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
                                            checked={Boolean(updateInput.Visibility)}
                                            onChange={(e) => {
                                                setUpdateInput({ ...updateInput, Visibility: e.target.checked })
                                            }}
                                            name="Visibility"
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
                        <button onClick={handleEditSubmit} className='submitbtn' variant="contained" type="submit">{t('Save Changes')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
