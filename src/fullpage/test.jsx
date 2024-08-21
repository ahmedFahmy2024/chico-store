import { useState, useContext, useEffect, useRef } from 'react'
import { LocalContext } from '../context/LocalContext';
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CATEGORIES, PRODUCTS, baseUrl } from '../api/Api';
import { Editor } from '@tinymce/tinymce-react';
import '../css/productsadd.css';
import { Axios } from '../api/Axios';
import CustomField from '../components/CustomField';
import RelatedProducts from '../components/RelatedProducts';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Unstable_Grid2';
import ColorPicker from '../components/ColorPicker';
import { Stack, Switch } from '@mui/material';

export default function ProductsAdd() {
    const [category, setCategory] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const editorRefEn = useRef(null);
    const editorRefAr = useRef(null);
    const [loading, setLoading] = useState(false);
    const color = useRef('#000000');
    const background = useRef('#ffffff');

    //  ====== get all categories ========
    useEffect(() => {
        setLoading(true);
        axios.get(`${baseUrl}${CATEGORIES}`,)
            .then(function (response) {
                // console.log('categories', response.data.categories);
                setCategory(response.data.categories);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast('Something went wrong, please try again', 'error');
                setLoading(false);
            }
            );
    }, []);
    //  ====== get all categories ========

    //  ================ add state ================
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [addInput, setAddInput] = useState({
        NameEN: '',
        NameAR: '',
        Status: '',
        Category: '',
        Price: '',
        SalePrice: '',
        Quantity: '',
        DescriptionEn: '',
        DescriptionAr: '',
        switch: false
    })

    // console.log('addInput', typeof(addInput.switch))
    //  ================ add state ================

    //  ================ add function ================

    function handleImageChange(event) {
        const files = event.target.files;

        // Filter out non-File objects
        const validFiles = Array.from(files).filter(file => file instanceof File);

        const newSelectedImages = [...selectedImages, ...validFiles];
        setSelectedImages(newSelectedImages);

        // Preview images
        const previews = validFiles.map(file => URL.createObjectURL(file));

        // Concatenate new previews with existing previews
        setImagePreviews([...imagePreviews, ...previews]);
    }

    // Remove image from selected images
    const removeImage = (index) => {
        // Filter out the image at the specified index from both arrays
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

        // Update the state with the filtered arrays
        setSelectedImages(updatedImages);
        setImagePreviews(updatedPreviews);
    };

    function handleEditorChangeEn(content) {
        setAddInput({ ...addInput, DescriptionEn: content });
    }

    function handleEditorChangeAr(content) {
        setAddInput({ ...addInput, DescriptionAr: content });
    }

    async function handleDialogSubmit(e) {
        e.preventDefault();
        setLoading(true);
        let form = new FormData();
        form.append("Name_en", addInput.NameEN);
        form.append("Name_ar", addInput.NameAR);
        form.append("status", addInput.Status);
        form.append("category_id", addInput.Category);
        form.append("price", addInput.Price);
        form.append("sale_price", addInput.SalePrice);
        form.append("stock", addInput.Quantity);
        form.append("Description_en", addInput.DescriptionEn);
        form.append("Description_ar", addInput.DescriptionAr);
        form.append("landing_switch", addInput.switch);
        form.append("background_color", background.current);
        form.append("text_color", color.current);
        // Append each recommendation individually
        for (let i = 0; i < selectedImages.length; i++) {
            form.append(`images[]`, selectedImages[i]);
        }
        // console.log(addInput, selectedImages);
        try {
            const response = await Axios.post(`${PRODUCTS}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            // console.log(response);
            setLoading(false);
            showHideToast(t("Added successfully"));
            setAddInput({
                NameEN: '',
                NameAR: '',
                Status: '',
                Category: '',
                Price: '',
                SalePrice: '',
                Quantity: '',
                DescriptionEn: '',
                DescriptionAr: '',
                switch: false
            })
            setSelectedImages([]);
            navigate("/dashboard/products");
        } catch (error) {
            console.log(error);
            setLoading(false);
            showHideToast("Something went wrong, please try again", 'error');
        }
    }
    //  ================ add function ================

    const btnIsDisabled = !addInput.NameEN || !addInput.NameAR || !addInput.Status || !addInput.Category || !addInput.Price || !addInput.SalePrice || !addInput.Quantity || !addInput.DescriptionEn || !addInput.DescriptionAr || !selectedImages.length

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "productsadd"].join(" ")}>
            <Container maxWidth="lg">

                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Create a new product')}
                </h4>
                <Grid container spacing={2}>
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Title, short description, image...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <TextField value={addInput.NameEN} onChange={(e) => { setAddInput({ ...addInput, NameEN: e.target.value }) }} fullWidth id="Name-EN" label={t("Product Name EN")} variant="outlined" />
                                <TextField value={addInput.NameAR} onChange={(e) => { setAddInput({ ...addInput, NameAR: e.target.value }) }} fullWidth id="Name-AR" label={t("Product Name AR")} variant="outlined" />

                                <div className="editor" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Description En")}</h6>
                                    <Editor
                                        apiKey='0vek97ozohsnqwnka2gvmm8kgvlrrj8pdpg3hl32h51ajb4r'
                                        onInit={(evt, editor) => editorRefEn.current = editor}
                                        // initialValue="<p>This is the initial content of the editor.</p>"
                                        init={{
                                            height: 300,
                                            resize: false,
                                            // menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help | image',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                            /* enable title field in the Image dialog */
                                            image_title: true,
                                            /* enable automatic uploads of images represented by blob or data URIs */
                                            automatic_uploads: true,
                                            /* here we add custom filepicker only to Image dialog */
                                            file_picker_types: 'image',
                                            /* and here's our custom image picker */
                                            file_picker_callback: (cb, value, meta) => {
                                                const input = document.createElement('input');
                                                input.setAttribute('type', 'file');
                                                input.setAttribute('accept', 'image/*');

                                                input.addEventListener('change', (e) => {
                                                    const file = e.target.files[0];

                                                    const reader = new FileReader();
                                                    reader.addEventListener('load', () => {
                                                        /* call the callback and populate the Title field with the file name */
                                                        cb(reader.result, { title: file.name });
                                                    });
                                                    reader.readAsDataURL(file);
                                                });

                                                input.click();
                                            },
                                            /* override default upload handler to use base64 image data */
                                            images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    resolve(reader.result);
                                                };
                                                reader.onerror = () => {
                                                    reject('Could not read file');
                                                };
                                                reader.readAsDataURL(blobInfo.blob());
                                            })
                                        }}
                                        onChange={(event, editor) => handleEditorChangeEn(editor.getContent())}
                                    />
                                </div>

                                <div className="editor" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Description Ar")}</h6>
                                    <Editor
                                        apiKey='0vek97ozohsnqwnka2gvmm8kgvlrrj8pdpg3hl32h51ajb4r'
                                        onInit={(evt, editor) => editorRefAr.current = editor}
                                        // initialValue="<p>This is the initial content of the editor.</p>"
                                        init={{
                                            height: 300,
                                            resize: false,
                                            // menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help | image',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                            /* enable title field in the Image dialog */
                                            image_title: true,
                                            /* enable automatic uploads of images represented by blob or data URIs */
                                            automatic_uploads: true,
                                            /* here we add custom filepicker only to Image dialog */
                                            file_picker_types: 'image',
                                            /* and here's our custom image picker */
                                            file_picker_callback: (cb, value, meta) => {
                                                const input = document.createElement('input');
                                                input.setAttribute('type', 'file');
                                                input.setAttribute('accept', 'image/*');

                                                input.addEventListener('change', (e) => {
                                                    const file = e.target.files[0];

                                                    const reader = new FileReader();
                                                    reader.addEventListener('load', () => {
                                                        /* call the callback and populate the Title field with the file name */
                                                        cb(reader.result, { title: file.name });
                                                    });
                                                    reader.readAsDataURL(file);
                                                });

                                                input.click();
                                            },
                                            /* override default upload handler to use base64 image data */
                                            images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    resolve(reader.result);
                                                };
                                                reader.onerror = () => {
                                                    reject('Could not read file');
                                                };
                                                reader.readAsDataURL(blobInfo.blob());
                                            })
                                        }}
                                        onChange={(event, editor) => handleEditorChangeAr(editor.getContent())}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Images")}</h6>
                                    <div style={{ width: '100%', position: 'relative' }}>
                                        <div className='images' onClick={() => document.querySelector('.input-field').click()}>
                                            <input onChange={handleImageChange} className='input-field' style={{ display: 'none' }} accept="image/*" multiple type="file" />
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
                                            {imagePreviews.map((image, index) => (
                                                <div className='preview' key={index}>
                                                    <span className='prev-image'>
                                                        <img src={image} alt="" />
                                                        <button className='close' onClick={() => removeImage(index)}>
                                                            <CloseIcon sx={{ fontSize: '14px', color: 'white' }} />
                                                        </button>
                                                    </span>
                                                </div>
                                            ))}
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
                                    <Grid xs={12} md={6}>
                                        <TextField value={addInput.Quantity} onChange={(e) => { setAddInput({ ...addInput, Quantity: e.target.value }) }} fullWidth id="outlined-basic" label={t("Quantity")} variant="outlined" />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>{t('Status')}</InputLabel>
                                            <Select
                                                value={addInput.Status}
                                                onChange={(e) => {
                                                    setAddInput({ ...addInput, Status: e.target.value })
                                                }}
                                                name="Status"
                                                required
                                            >
                                                <MenuItem value="draft">{t("draft")}</MenuItem>
                                                <MenuItem value="published">{t("published")}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <TextField value={addInput.Price} onChange={(e) => { setAddInput({ ...addInput, Price: e.target.value }) }} fullWidth id="outlined-basic" label={t("Price")} variant="outlined" />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <TextField value={addInput.SalePrice} onChange={(e) => { setAddInput({ ...addInput, SalePrice: e.target.value }) }} fullWidth id="outlined-basic" label={t("Sale Price")} variant="outlined" />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>{t('Category')}</InputLabel>
                                            <Select
                                                value={addInput.Category}
                                                onChange={(e) => {
                                                    setAddInput({ ...addInput, Category: e.target.value })
                                                }}
                                                name="Category"
                                                required
                                            >
                                                {category.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>{locale === "en" ? item.Name_en : item.Name_ar}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Grid>
                    {/* <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Related products")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Add the products you want to display for customer after purchasing")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <RelatedProducts handleRecommendationChange={handleRecommendationChange} />
                            </div>
                        </div>
                    </Grid> */}
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Style options")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Text color and background and products display")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <ColorPicker color={color} text={t("Text color")} />
                                <ColorPicker color={background} text={t("Background color")} />
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <span>{t('Landing Switch')}</span>
                                    <Switch
                                        checked={addInput.switch}
                                        onChange={(e) => {
                                            setAddInput({ ...addInput, switch: e.target.checked })
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                </Stack>
                            </div>
                        </div>
                    </Grid>

                </Grid>
                <Grid container spacing={2}>
                    <Grid md={4}></Grid>
                    <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
                        <button onClick={handleDialogSubmit} disabled={btnIsDisabled} className={btnClasses} type="submit">{t('Create Product')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
