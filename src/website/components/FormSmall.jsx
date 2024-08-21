import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";

const FormSmall = ({ handleForm, addInput, errors }) => {
  const { t } = useTranslation();
  return (
    <div className="form">
      <TextField
        required
        value={addInput.name}
        onChange={handleForm}
        type="text"
        name="name"
        label={t("اكتب اسمك بالكامل هنا")}
        variant="outlined"
      />
      { errors.name && <span style={{ color: "red" }}>{errors.name}</span> }
      <TextField
        required
        value={addInput.phone}
        onChange={handleForm}
        type="number"
        name="phone"
        label={t("تأكد من كتابة رقم الهاتف شكل صحيح 11 رقم")}
        variant="outlined"
      />
      { errors.name && <span style={{ color: "red" }}>{errors.name}</span> }
      <TextField
        required
        value={addInput.address}
        onChange={handleForm}
        type="text"
        name="address"
        label={t(
          "-الشارع-رقم البيت-علامه مميزه بجوار المنزل  برجاء التأكد من كتابه العنوان بشكل تفصيلي وليس اسم الشارع أو المنطقه فقط لكي يتم شحن الاوردر "
        )}
        variant="outlined"
      />
      { errors.name && <span style={{ color: "red" }}>{errors.name}</span> }    </div>
  );
};

export default FormSmall;
