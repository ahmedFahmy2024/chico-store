import { useContext } from 'react';
import { LocalContext } from '../../context/LocalContext';

export default function FormatPrice({price, sale_price}) {
    const { locale } = useContext(LocalContext);
    const formattedPrice = sale_price ? sale_price : price ;
    const localeString = locale === "en" ? "en-EG" : "ar-EG";
    
    return Intl.NumberFormat(localeString, {
        style: "currency",
        currency: "EGP",
        maximumFractionDigits: 0,
      }).format(formattedPrice);
}


