import { useCheckOut } from "../context/CheckOutProvider"
import { useCart } from "../context/CartProvider";
import axios from "axios";
import { baseUrl, ORDERS } from "../../api/Api";
import ToastContext from '../../context/ToastProvider';
import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { logEvent } from "./fbPixel";

function CheckOutFn() {
    const { personalInfo, setPersonalInfo, setRecommendations } = useCheckOut();
    const { cart, clearCart, total_price, shipping_fee, discount } = useCart()
    const { t } = useTranslation();
    const { showHideToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // console.log('cart', cart)

    // ========== to store data before unloading start ==========
    useEffect(() => {
        const storedData = localStorage.getItem('checkoutFormData');
        if (storedData) {
            setPersonalInfo(JSON.parse(storedData));
        }

        const handleBeforeUnload = () => {
            localStorage.removeItem('checkoutFormData');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    // ========== to store data before unloading end ==========

    // useEffect to save data to localStorage before unloading
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem('checkoutFormData', JSON.stringify(personalInfo));
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    });
    // useEffect to save data to localStorage before unloading

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

    // google sheet
    const handleSubmit = ({ order }) => {
        const formData = new FormData();
        formData.append('name', personalInfo.FullName);
        formData.append('phone', personalInfo.Phone);
        formData.append('address', personalInfo.AddressDetails);
        // Concatenate product details into a single string for each field
        const productEn = cart.map(item => item.nameEn).join(', ');
        const productAr = cart.map(item => item.nameAr).join(', ');
        const quantities = cart.map(item => item.amount).join(', ');

        formData.append('productEn', productEn);
        formData.append('productAr', productAr);
        formData.append('quantity', quantities);
        formData.append('total_price', total_price);
        formData.append('order_number', order);

    
        fetch("https://script.google.com/macros/s/AKfycbzJy0tGhKE_1OSzugWzl3Yk4gJ4i3agoSJclvfp-VcZB8ldoC-MoVYTrmTHgz73uDOxXQ/exec", {
          method: "POST",
          body: formData
        })
          .then((res) => res.json())
          .then((data) => {
            // console.log("google", data);
          })
          .catch((err) => {
            console.error(err);
          });
      };

    // ========== send data to backend start ==========
    async function handleCheckout(e) {
        e.preventDefault();
        setLoading(true);
        const products = cart.map(item => ({ id: item.id, quantity: item.amount }));

        const params = {
            status: 'processing',
            total_order_price: total_price,
            products: products,
            street: personalInfo.AddressDetails,
            country: personalInfo.AddressDetails,
            shipping_cost: shipping_fee,
            discount: discount,
            full_name: personalInfo.FullName,
            phone: personalInfo.Phone,
        }
        // console.log("params", params)
        try {
            const response = await axios.post(`${baseUrl}${ORDERS}`, params, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            // console.log(response)
            const recommendations = response.data.recommended_products;
            setRecommendations(recommendations);
            localStorage.setItem('recommendations', JSON.stringify(recommendations));
            handleSubmit({
                order: response.data.order.order_number,
            });
            logEvent('Purchase', { currency: 'EGP', value: response.data.order.total_order_price });
            showHideToast(t("Added successfully"));
            clearCart();
            setPersonalInfo({
                AddressDetails: '',
                FullName: '',
                Phone: '',
            })

            setLoading(false);
            localStorage.removeItem('checkoutFormData');
            // window.location.href = '/thanks';
            navigate('/thanks')

        } catch (error) {
            console.log(error)
            showHideToast('Something went wrong, please try again', 'error');
            setLoading(false);
        }
    }
    // ========== send data to backend end ==========
    return { handleCheckout }
}

export default CheckOutFn