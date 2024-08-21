import Multiselect from 'multiselect-react-dropdown';
import { useContext, useState, useEffect } from 'react';
import { LocalContext } from '../context/LocalContext';
import ToastContext  from '../context/ToastProvider';
import { Axios } from '../api/Axios';
import { PRODUCTS } from '../api/Api';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function RelatedProducts({handleRecommendationChange, selectedProducts}) {
    const { locale, setLocale } = useContext(LocalContext);
    const [loading, setLoading] = useState(false);
    const { showHideToast } = useContext(ToastContext);
    const [productOptions, setProductOptions] = useState([])

        //  ====== get all product ========
        useEffect(() => {
            setLoading(true);
            Axios.get(`${PRODUCTS}`,)
                .then(function (response) {
                    // console.log(response.data.products);
                    const products = response.data.products;
                    const options = products.map(product => ({
                        cat: product.id, 
                        key: product.Name_ar
                    }));
                    setProductOptions(options);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    showHideToast('Something went wrong, please try again', 'error');
                    setLoading(false);
                });
        }, []);
        //  ====== get all product ========

        const handleSelect = (selectedList, selectedItem) => {
            // console.log('Selected Item:', selectedItem);
            handleRecommendationChange(selectedList);
        };

        const handleRemove = (selectedList, removedItem) => {
            // console.log('Removed Item:', removedItem);
            handleRecommendationChange(selectedList);
        };

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "relatedproducts"].join(" ")}>
            <Multiselect
                displayValue="key"
                onKeyPressFn={function noRefCheck() { }}
                onRemove={handleRemove}
                onSearch={function noRefCheck() { }}
                onSelect={handleSelect}
                options={productOptions}
                showCheckbox
                selectedValues={selectedProducts}
            />
        </div>
    )
}

export default RelatedProducts