import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { LocalContext } from "../../context/LocalContext";
import { baseUrl, PRODUCTS } from "../../api/Api";
import { useProduct } from "../context/ProductProvider";
import "../css/oneproduct.css";
import OneProductStyleOne from "../components/OneProductStyleOne";
import OneProductStyleTwo from "../components/OneProductStyleTwo";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const oneProductApi = `${baseUrl}${PRODUCTS}`;

function OneProduct() {
  const { getSingleProduct, isSingleLoading, singleProduct } = useProduct();
  const { product } = singleProduct || {};
  const { locale } = useContext(LocalContext);
  const [amount, setAmount] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    getSingleProduct(`${oneProductApi}/${id}`);
  }, []);


  if (isSingleLoading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }

  // increase and decrease amount
  const setDecrease = () => {
    amount > 1 ? setAmount(amount - 1) : setAmount(1);
  };
  const setIncrease = () => {
    amount < product?.stock ? setAmount(amount + 1) : setAmount(product?.stock);
  };

  // Calculate the prices
  const basePrice = product?.sale_price ? product.sale_price : product?.price;
  const originalPrice = basePrice * amount;
  let finalPrice = Math.ceil(originalPrice);

  if (amount === 2) {
    finalPrice = originalPrice * 0.9; // 10% discount
  } else if (amount >= 3) {
    finalPrice = originalPrice * 0.85; // 15% discount
  }

  return (
    <div
      className={[locale === "en" ? "ltr" : "rtl", ""].join(" ")}
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      {product?.landing_switch === 1 ? (
        <OneProductStyleTwo
          product={product}
          finalPrice={finalPrice}
          amount={amount}
          setAmount={setAmount}
        />
      ) : (
        <OneProductStyleOne
          product={product}
          originalPrice={originalPrice}
          finalPrice={finalPrice}
          amount={amount}
          setAmount={setAmount}
          setDecrease={setDecrease}
          setIncrease={setIncrease}
        />
      )}
    </div>
  );
}

export default OneProduct;
