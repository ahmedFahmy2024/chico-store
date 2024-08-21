import { useState, useContext, useEffect, useRef } from 'react'
import { LocalContext } from '../context/LocalContext';
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CATEGORIES, PRODUCTS, baseUrl } from '../api/Api';
import { Axios } from '../api/Axios';
import { Editor } from '@tinymce/tinymce-react';
import '../css/productsedit.css';
import RelatedProducts from '../components/RelatedProducts';

import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Unstable_Grid2';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ColorPicker from '../components/ColorPicker';
import { Stack, Switch } from '@mui/material';


export default function ProductsEdit() {
    const [category, setCategory] = useState([]);
    const { locale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const editorRefEn = useRef(null);
    const editorRefAr = useRef(null);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const color = useRef('#000000');
    const background = useRef('#ffffff');

    //  ================ edit state ================
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [updateInput, setUpdateInput] = useState({
        NameAr: '',
        NameEn: '',
        DescriptionEn: '',
        DescriptionAr: '',
        Price: '',
        SalePrice: '',
        Quantity: '',
        Status: '',
        Category: '',
        switch: false,
        Recommendation_ID: [],
    })
    const [productOptions, setProductOptions] = useState([]);

    function handleForm(e) {
        setUpdateInput({ ...updateInput, [e.target.name]: e.target.value })
    }
    //  ================ edit state ================

    //  ====== get all categories ========
    useEffect(() => {
        axios.get(`${baseUrl}${CATEGORIES}`,)
            .then(function (response) {
                // console.log('categories', response.data.categories);
                setCategory(response.data.categories);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast('Something went wrong, please try again', 'error');
            }
            );
    }, []);
    //  ====== get all categories ========

    //  ====== get specific product ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${PRODUCTS}/${id}`,)
            .then(function (response) {
                // console.log(response.data.product);
                const data = response.data.product;
                setUpdateInput({
                    NameAr: data.Name_ar,
                    NameEn: data.Name_en,
                    DescriptionEn: data.Description_en,
                    DescriptionAr: data.Description_ar,
                    Price: data.price,
                    SalePrice: data.sale_price,
                    Quantity: data.stock,
                    Status: data.status,
                    Category: data.category_id,
                    switch: data.landing_switch === 1 ? true : false,
                    Recommendation_ID: data.recommendations.map(recommendation => recommendation.id),
                })
                const imagePaths = data.images ? data.images.split(',') : [];
                setImagePreviews(imagePaths);
                color.current = data.text_color;
                background.current = data.background_color;
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast('something went wrong, please try again', 'error');
                setLoading(false);
            });

        // Fetch all products
        Axios.get(`${PRODUCTS}`)
            .then((response) => {
                const products = response.data.products;
                const options = products.map(product => ({
                    cat: product.id,
                    key: product.Name_ar
                }));
                setProductOptions(options);
            })
            .catch((error) => {
                console.log(error);
                showHideToast('Something went wrong, please try again', 'error');
            });
    }, []);

    // =============== get selected recommendations ===============

    // Filter products based on Recommendation_ID
    const selectedProducts = productOptions.filter(product => {
        return updateInput.Recommendation_ID.includes(product.cat);
    });
    // console.log('selectedProducts', selectedProducts);

    const handleRecommendationChange = (selectedList) => {
        const selectedIds = selectedList.map(item => item.cat).filter(id => id); // Ensure valid IDs
        setUpdateInput({ ...updateInput, Recommendation_ID: selectedIds });
    };


    //  ====== get specific product ========

    //  ================ edit function ================

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
        setUpdateInput({ ...updateInput, DescriptionEn: content });
    }

    function handleEditorChangeAr(content) {
        setUpdateInput({ ...updateInput, DescriptionAr: content });
    }
    // console.log('updateInput', updateInput)

    async function handleEditSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // Validate Recommendation_ID
        const validRecommendationIds = updateInput.Recommendation_ID.filter(id => id && id !== "");
        // console.log('Valid Recommendation_ID:', validRecommendationIds);

        let form = new FormData();
        form.append('_method', 'PUT');
        form.append("Name_en", updateInput.NameEn);
        form.append("Name_ar", updateInput.NameAr);
        form.append("status", updateInput.Status);
        form.append("category_id", updateInput.Category);
        form.append("price", updateInput.Price);
        form.append("sale_price", updateInput.SalePrice);
        form.append("stock", updateInput.Quantity);
        form.append("Description_en", updateInput.DescriptionEn);
        form.append("Description_ar", updateInput.DescriptionAr);
        form.append("landing_switch", updateInput.switch ? 1 : 0);
        form.append("background_color", background.current);
        form.append("text_color", color.current);
        validRecommendationIds.forEach(id => {
            form.append("recommendations[]", id);
        });
        // Append existing image paths
        imagePreviews.forEach(preview => {
            // Check if the preview is not a File object (i.e., it's a URL)
            if (!(preview instanceof File)) {
                form.append(`images[]`, preview);
            }
        });
        // Append newly uploaded images
        selectedImages.forEach(image => {
            // Check if the file is a valid image
            if (image instanceof File && isValidImageFile(image)) {
                form.append(`images[]`, image);
            }
        });
        try {
            const response = await Axios.post(`${PRODUCTS}/${id}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            // console.log(response);
            setLoading(false);
            showHideToast(t("Updated successfully"));
            navigate("/dashboard/products");
        } catch (error) {
            console.log(error);
            setLoading(false);
            showHideToast('Something went wrong, please try again', 'error');
        }
    }
    function isValidImageFile(file) {
        // List of allowed image file extensions
        const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif'];
        // Get the file extension
        const extension = file.name.split('.').pop().toLowerCase();
        // Check if the extension is included in the allowed list
        return allowedExtensions.includes(extension);
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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "productsEdit"].join(" ")}>
            <Container maxWidth="lg">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Edit')}
                </h4>
                <Grid container spacing={2}>
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Title, short description, image...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <TextField value={updateInput.NameEn} onChange={handleForm} fullWidth name='NameEn' label={t("Product Name EN")} variant="outlined" />
                                <TextField value={updateInput.NameAr} onChange={handleForm} fullWidth name='NameAr' label={t("Product Name AR")} variant="outlined" />

                                <div className="editor" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Description En")}</h6>
                                    <Editor
                                        apiKey='0vek97ozohsnqwnka2gvmm8kgvlrrj8pdpg3hl32h51ajb4r'
                                        onInit={(evt, editor) => editorRefEn.current = editor}
                                        // initialValue="<p>This is the initial content of the editor.</p>"
                                        init={{
                                            height: 500,
                                            min_height: 300, 
                                            resize: true,
                                            // menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'autoresize'
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
                                        initialValue={updateInput.DescriptionEn}
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
                                            height: 500,
                                            min_height: 300,
                                            resize: true,
                                            // menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'autoresize'
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
                                        initialValue={updateInput.DescriptionAr}
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
                                            {imagePreviews.map((preview, index) => (
                                                <div className='preview' key={index}>
                                                    <span className='prev-image'>
                                                        <img src={preview} alt="" />
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
                                        <TextField value={updateInput.Quantity} onChange={handleForm} fullWidth name='Quantity' label={t("Quantity")} variant="outlined" />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>{t('Status')}</InputLabel>
                                            <Select
                                                value={updateInput.Status}
                                                onChange={handleForm}
                                                name="Status"
                                                required
                                            >
                                                <MenuItem value="draft">{t("draft")}</MenuItem>
                                                <MenuItem value="published">{t("published")}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <TextField value={updateInput.Price} onChange={handleForm} fullWidth name='Price' label={t("Price")} variant="outlined" />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <TextField value={updateInput.SalePrice} onChange={handleForm} fullWidth name='SalePrice' label={t("Sale Price")} variant="outlined" />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>{t('Category')}</InputLabel>
                                            <Select
                                                value={updateInput.Category}
                                                onChange={(e) => {
                                                    setUpdateInput({ ...updateInput, Category: e.target.value })
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
                                        checked={updateInput.switch}
                                        onChange={(e) => {
                                            setUpdateInput({ ...updateInput, switch: e.target.checked })
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                </Stack>
                            </div>
                        </div>
                    </Grid>

                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Related products")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Add the products you want to display for customer after purchasing")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <RelatedProducts selectedProducts={selectedProducts} handleRecommendationChange={handleRecommendationChange} />
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
