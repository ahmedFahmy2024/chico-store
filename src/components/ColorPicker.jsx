import { useState } from "react";
import "../css/ColorPicker.css";
import { useTranslation } from "react-i18next";

const ColorPicker = ({ text, color }) => {
  const { t } = useTranslation();
  const handleColorChange = (e) => {
    color.current = e.target.value;
  };

  return (
    <div className="color-picker-container">
      <h1>{t(text)}</h1>
      <input
        type="color"
        defaultValue={color.current}
        onChange={handleColorChange}
        className="color-picker"
      />
    </div>
  );
};

export default ColorPicker;
