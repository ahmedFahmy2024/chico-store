import React, { useContext, useRef, useState } from "react";
import ImageSlider from "./ImageSlider";
import "../css/oneproductstyletwo.css";
import { LocalContext } from "../../context/LocalContext";
import { useTranslation } from "react-i18next";
import { Container } from "@mui/material";
import { Icon } from "@iconify/react";

import FormatPrice from "../helpers/FormatPrice";
import CountDown from "./CountDown";
import FormSmall from "./FormSmall";
import RadioBtnsSmall from "./RadioBtnsSmall";
import OneStyleTwoFooter from "./OneStyleTwoFooter";
import axios from "axios";
import { baseUrl, ORDERS } from "../../api/Api";
import ToastContext from "../../context/ToastProvider";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useCheckOut } from "../context/CheckOutProvider";
import { logEvent } from "../helpers/fbPixel";
import { useNavigate } from "react-router-dom";

const OneProductStyleTwo = ({ product, finalPrice, amount, setAmount }) => {
  const [addInput, setAddInput] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { setRecommendations } = useCheckOut();
  const [loading, setLoading] = useState(false);
  const { showHideToast } = useContext(ToastContext);
  const { locale } = useContext(LocalContext);
  const { t } = useTranslation();

  const handleForm = (e) => {
    setAddInput({
      ...addInput,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    return addInput.name && addInput.phone && addInput.address;
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = ({ order }) => {
    const formData = new FormData();
    formData.append("name", addInput.name);
    formData.append("phone", addInput.phone);
    formData.append("address", addInput.address);
    formData.append("productEn", product.Name_en);
    formData.append("productAr", product.Name_ar);
    formData.append("quantity", amount);
    formData.append("total_price", finalPrice);
    formData.append("order_number", order);

    fetch(
      "https://script.google.com/macros/s/AKfycbzJy0tGhKE_1OSzugWzl3Yk4gJ4i3agoSJclvfp-VcZB8ldoC-MoVYTrmTHgz73uDOxXQ/exec",
      {
        method: "POST",
        body: formData,
      }
    )
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
    if (!validateForm()) {
      setErrors({
        ...errors,
        name: "required",
        phone: "required",
        address: "required",
      });
      showHideToast(t("Please fill all required fields"), "error");
      scrollToForm();
      return;
    }
    setLoading(true);

    const params = {
      status: "processing",
      total_order_price: finalPrice,
      products: [{ id: product.id, quantity: amount }],
      country: addInput.address,
      street: addInput.address,
      shipping_cost: 0,
      discount: 0,
      full_name: addInput.name,
      phone: addInput.phone,
    };
    // console.log("params", params)
    try {
      const response = await axios.post(`${baseUrl}${ORDERS}`, params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      showHideToast(t("Added successfully"));
      const recommendations = response.data.recommended_products;
      setRecommendations(recommendations);
      localStorage.setItem("recommendations", JSON.stringify(recommendations));
      handleSubmit({
        order: response.data.order.order_number,
      });
      logEvent('Purchase', { currency: 'EGP', value: response.data.order.total_order_price });
      setAddInput({
        name: "",
        phone: "",
        address: "",
      });

      setLoading(false);
    //   window.location.href = "/thanks";
      navigate('/thanks')
    } catch (error) {
      console.log(error);
      showHideToast("Something went wrong, please try again", "error");
      setLoading(false);
    }
  }

  // ================= loading =================
  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div
      dir={locale === "en" ? "ltr" : "rtl"}
      className={[locale === "en" ? "ltr" : "rtl", "oneproductstyletwo"].join(
        " "
      )}
    >
      <div
        className="background"
        style={{ backgroundColor: product?.background_color }}
      >
        <Container maxWidth="lg">
          <ImageSlider images={product?.images} />
          <div className="order-now-btn-container">
            <button onClick={handleCheckout} className="order-now-btn">
              {t("اطلبه دلوقتى من هنا")}
            </button>
          </div>
          <div className="desc-container">
            <div
              style={{ color: product?.text_color }}
              className="desc"
              dangerouslySetInnerHTML={{
                __html:
                  locale === "en"
                    ? product?.Description_en
                    : product?.Description_ar,
              }}
            />
          </div>
          <div className="order-now-btn-container">
            <button onClick={handleCheckout} className="order-now-btn">
              {t("اطلبه دلوقتي و استمتع بالشحن المجاني")}
            </button>
          </div>
          <div className="content-body">
            <div className="product-name">
              {locale === "en" ? product?.Name_en : product?.Name_ar}
            </div>
            <hr />
            <div className="stack">
              <div className="sale-price">
                <FormatPrice price={product?.sale_price} />
              </div>
              <div className="price">
                <FormatPrice price={product?.price} />
              </div>
              <div className="discount">15% -</div>
            </div>
            <hr />
            <div className="timer">
              <div className="text">{t("متبقي على انتهاء العرض :")}</div>
              <div className="count-down-timer">
                <CountDown duration={3 * 24 * 60 * 60 * 1000} />
              </div>
            </div>
            <h4 className="enter-info">{t(" دخل بياناتك و اطلبه دلوقتي :")}</h4>

            <div ref={formRef}>
              <FormSmall
                errors={errors}
                addInput={addInput}
                handleForm={handleForm}
              />
              <RadioBtnsSmall setAmount={setAmount} product={product} />
              <div className="order-now-btn-container">
                <button
                  onClick={handleCheckout}
                  className="order-now-btn fullwidth"
                >
                  {t("اطلب الان و أدفع عند الأستلام")}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <OneStyleTwoFooter />
      <div className="social-icons">
        <Icon icon="ic:baseline-facebook" width="24" height="24" />
        <Icon icon="hugeicons:instagram" width="24" height="24" />
        <Icon icon="mdi:twitter" width="24" height="24" />
      </div>
      <div className="sticky-btn">
        <button onClick={handleCheckout} className="order-now-btn">
          {t("اطلبه الان و استفيد بالخصم و الشحن المجاني")}
        </button>
      </div>
    </div>
  );
};

export default OneProductStyleTwo;
