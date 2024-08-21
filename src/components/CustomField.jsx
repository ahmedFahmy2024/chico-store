import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Unstable_Grid2';
import '../css/customfield.css'

import { useState } from 'react';

function CustomField() {
    const [customFields, setCustomFields] = useState([
        { field_name: '', field_type: 'select', field_values: [], extra_fees: {} }
    ]);

    const handleFieldValueChange = (index, type, value) => {
        const newCustomFields = [...customFields];
        newCustomFields[index][type] = value;
        setCustomFields(newCustomFields);
    };

    const handleExtraFeeChange = (index, extraFees) => {
        const newCustomFields = [...customFields];
        newCustomFields[index].extra_fees = extraFees;
        setCustomFields(newCustomFields);
    };

    const handleFieldValueArrayChange = (index, fieldValues) => {
        const newCustomFields = [...customFields];
        newCustomFields[index].field_values = fieldValues;
        // Preserve existing extra fees when updating field values
        const existingExtraFees = newCustomFields[index].extra_fees;
        newCustomFields[index].extra_fees = {};
        fieldValues.forEach(value => {
            if (existingExtraFees[value] !== undefined) {
                newCustomFields[index].extra_fees[value] = existingExtraFees[value];
            } else {
                newCustomFields[index].extra_fees[value] = 0; // Set default extra fee
            }
        });
        setCustomFields(newCustomFields);
    };

    const addCustomField = () => {
        setCustomFields([
            ...customFields,
            { field_name: '', field_type: 'select', field_values: [], extra_fees: {} }
        ]);
    };

    const handleRemoveCustomField = (index) => {
        const newCustomFields = [...customFields];
        newCustomFields.splice(index, 1);
        setCustomFields(newCustomFields);
    };

    const handleRemoveFieldValue = (fieldIndex, valueIndex) => {
        const newCustomFields = [...customFields];
        const fieldValues = newCustomFields[fieldIndex].field_values;
        const newFieldValues = fieldValues.filter((_, idx) => idx !== valueIndex);
        newCustomFields[fieldIndex].field_values = newFieldValues;
        delete newCustomFields[fieldIndex].extra_fees[fieldValues[valueIndex]];
        setCustomFields(newCustomFields);
    };

    const handleSubmit = () => {
        const customFieldsData = customFields.map(field => ({
            field_name: field.field_name,
            field_type: field.field_type,
            field_values: field.field_values,
            extra_fees: field.extra_fees,
        }));
        // console.log(customFieldsData);
        // You can handle submitting this data to your API or other logic here
    };

    return (
        <div className="custom-field-container">
            {customFields.map((field, fieldIndex) => (
                <Grid container spacing={2} key={fieldIndex}>
                    <Grid xs={12} md={6}>
                        <TextField
                            label={`Field Name ${fieldIndex + 1}`}
                            variant="outlined"
                            value={field.field_name}
                            onChange={(e) => handleFieldValueChange(fieldIndex, 'field_name', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid xs={12} md={6}>
                        <FormControl fullWidth >
                            <InputLabel>Field Type</InputLabel>
                            <Select
                                value={field.field_type}
                                onChange={(e) => {
                                    handleFieldValueChange(fieldIndex, 'field_type', e.target.value);
                                    // Reset field values and extra fees when changing field type
                                    handleFieldValueArrayChange(fieldIndex, []);
                                }}
                                label="Field Type"
                            >
                                <MenuItem value="select">Select</MenuItem>
                                <MenuItem value="radio">Radio</MenuItem>
                                <MenuItem value="input">Input</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {(field.field_type === 'select' || field.field_type === 'radio') && (
                        <>
                            {field.field_values.map((value, valueIndex) => (
                                <div className='custom-field-crud' key={valueIndex}>
                                    <Grid xs={12} sm={6} md={6}>
                                        <TextField
                                            label={`Value ${valueIndex + 1}`}
                                            variant="outlined"
                                            value={value}
                                            onChange={(e) => {
                                                const newFieldValues = [...field.field_values];
                                                newFieldValues[valueIndex] = e.target.value;
                                                handleFieldValueArrayChange(fieldIndex, newFieldValues);
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6} md={6}>
                                        <TextField
                                            label={`Extra Fee for ${value}`}
                                            variant="outlined"
                                            type="number"
                                            value={field.extra_fees[value] || 0}
                                            onChange={(e) => {
                                                const newExtraFees = { ...field.extra_fees };
                                                newExtraFees[value] = Number(e.target.value);
                                                handleExtraFeeChange(fieldIndex, newExtraFees);
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <IconButton color="error" aria-label="delete" onClick={() => handleRemoveFieldValue(fieldIndex, valueIndex)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            ))}
                            <Button
                                onClick={() => {
                                    const newFieldValues = [...field.field_values, ''];
                                    handleFieldValueArrayChange(fieldIndex, newFieldValues);
                                    const newExtraFees = { ...field.extra_fees };
                                    newExtraFees[''] = 0; // Set default extra fee for new value
                                    handleExtraFeeChange(fieldIndex, newExtraFees);
                                }}
                                variant="contained"
                                color="primary"
                                sx={{ mt: 1, mb: 2, mr: 2, flex:1 }}
                            >
                                Add Field Value
                            </Button>
                        </>
                    )}
                    <Button sx={{ mt: 1, mb: 2 }} color="error" variant="contained" onClick={() => handleRemoveCustomField(fieldIndex)} startIcon={<DeleteIcon />}>
                        Remove this Field
                    </Button>
                </Grid>
            ))}

            <Button
                onClick={addCustomField}
                variant="contained"
                color="primary"
                style={{ marginTop: '10px' }}
            >
                Add Custom Field
            </Button>

            <Button
                onClick={handleSubmit}
                variant="contained"
                color="secondary"
                style={{ marginTop: '10px' }}
            >
                Submit Custom Fields
            </Button>
        </div>
    );
}

export default CustomField;
