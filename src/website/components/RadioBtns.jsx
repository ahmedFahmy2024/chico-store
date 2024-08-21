import '../css/radiobtns.css';
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext';
import { useContext, useState } from 'react';

function RadioBtns({ setAmount}) {
    const { t } = useTranslation();
    const { locale } = useContext(LocalContext);
    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
        const value = parseInt(e.target.value, 10);
        setAmount(value);
    };

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "radiobtn"].join(" ")}>
            <div className="radio-container">
                <input type="radio" id="one-piece" name="offer" value="1" checked={selectedValue === "1"} onChange={handleChange} />
                <label htmlFor="one-piece">{t("One Piece Offer")}</label>

                <input type="radio" id="two-pieces" name="offer" value="2" checked={selectedValue === "2"} onChange={handleChange} />
                <label htmlFor="two-pieces">{t("Two Pieces Offer")}
                <span>{10}% {t("Discount")}</span>
                </label>

                <input type="radio" id="three-pieces" name="offer" value="3" checked={selectedValue === "3"} onChange={handleChange} />
                <label htmlFor="three-pieces">{t("Three Pieces Offer")}
                <span>{15}% {t("Discount")}</span>
                </label>
            </div>

        </div>
    )
}

export default RadioBtns