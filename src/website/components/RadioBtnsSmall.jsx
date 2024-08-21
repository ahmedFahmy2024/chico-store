import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext';
import { useContext, useState } from 'react';
import FormatPrice from '../helpers/FormatPrice';

function RadioBtnsSmall({ setAmount, product }) {
    const { t } = useTranslation();
    const { locale } = useContext(LocalContext);
    const [selectedValue, setSelectedValue] = useState("1");

    const basePrice = product?.sale_price || product?.price;

    const calculatePrice = (quantity) => {
        const originalPrice = basePrice * quantity;
        let finalPrice = originalPrice;

        if (quantity === 2) {
            finalPrice = originalPrice * 0.9; // 10% discount
        } else if (quantity >= 3) {
            finalPrice = originalPrice * 0.85; // 15% discount
        }

        return { originalPrice, finalPrice };
    };

    const handleChange = (value) => {
        setSelectedValue(value);
        setAmount(parseInt(value, 10));
    };

    const { originalPrice: originalPrice1, finalPrice: finalPrice1 } = calculatePrice(1);
    const { originalPrice: originalPrice2, finalPrice: finalPrice2 } = calculatePrice(2);
    const { originalPrice: originalPrice3, finalPrice: finalPrice3 } = calculatePrice(3);
    // console.log("selectedValue", selectedValue)

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "radiobtnsmall"].join(" ")}>
            <div className="radio-container">

                <div className={`row ${selectedValue === "1" ? 'selected' : ''}`} onClick={() => handleChange("1")}>
                    <div className="one-sec">
                        <input type="radio" id="one-piece" name="offer" value="1" checked={selectedValue === "1"} onChange={() => {}} />
                        <label htmlFor="one-piece">{t("One Piece Offer")}</label>
                    </div>
                    <div className="two-sec">
                        <div className="discount-from">
                            <FormatPrice price={finalPrice1} />
                        </div>
                        <div className="not-discount-form">
                            <FormatPrice price={originalPrice1} />
                        </div>
                    </div>
                </div>

                <div className={`row small ${selectedValue === "2" ? 'selected' : ''}`} onClick={() => handleChange("2")}>
                    <div className='ribbons'>الأكثر طلبا اخر 24 ساعة
                        <p>
                            <span className='left'></span>
                            <span className='right'></span>
                        </p>
                    </div>
                    <div className="one-sec">
                        <input type="radio" id="two-pieces" name="offer" value="2" checked={selectedValue === "2"} onChange={() => {}} />
                        <label htmlFor="two-pieces">{t("Two Pieces Offer")}
                            <span className='offer-discount-gray'>{t("Additional discount")} 10%</span>
                        </label>
                    </div>
                    <div className="two-sec">
                        <div className="discount-from">
                            <FormatPrice price={finalPrice2} />
                        </div>
                        <div className="not-discount-form">
                            <FormatPrice price={originalPrice2} />
                        </div>
                    </div>
                </div>

                <div className={`row small ${selectedValue === "3" ? 'selected' : ''}`} onClick={() => handleChange("3")}>
                    <div className='ribbons green'>الأوفر ليك
                        <p>
                            <span className='left'></span>
                            <span className='right'></span>
                        </p>
                    </div>
                    <div className="one-sec">
                        <input type="radio" id="three-pieces" name="offer" value="3" checked={selectedValue === "3"} onChange={() => {}}/>
                        <label htmlFor="three-pieces">{t("Three Pieces Offer")}
                            <span className='offer-discount-gray'>{t("Additional discount")} 15%</span>
                        </label>
                    </div>
                    <div className="two-sec">
                        <div className="discount-from">
                            <FormatPrice price={finalPrice3} />
                        </div>
                        <div className="not-discount-form">
                            <FormatPrice price={originalPrice3} />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default RadioBtnsSmall
