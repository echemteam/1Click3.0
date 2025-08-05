import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import "./Input.scss";
import Iconify from "../iconify/Iconify";

const TextInputType = {
    TEXT: "text",
    FILE: "file",
    EMAIL: "email",
    PASSWORD: "password",
    NUMBER: "number",
    CHECKBOX: "checkbox",
    DATEPICKER: "datepicker",
    RADIO: 'radio',
}

const NumberValueType = {
    INT: "INT",
    DECIMAL: "DECIMAL",
}

const excptIntSymbol = ["e", "E", "+", "-"];
const excptDecimalSymbol = ["e", "E", "+", "-"];

/**
 * A customizable input component that supports various input types and validation.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.type - The type of input field (e.g., text, number).
 * @param {string} [props.name=""] - The name attribute for the input field.
 * @param {string} [props.placeholder=`${name}`] - The placeholder text for the input field.
 * @param {string|number} props.value - The value of the input field.
 * @param {number} [props.min] - The minimum value (for number inputs).
 * @param {number} [props.max] - The maximum value (for number inputs).
 * @param {Function} props.onChange - Callback function when input value changes.
 * @param {Function} [props.onBlur] - Callback function when the input loses focus.
 * @param {number} [props.minLength] - The minimum length of the input.
 * @param {number} [props.maxLength] - The maximum length of the input.
 * @param {string} [props.cssClass="input-field"] - CSS class for styling the input.
 * @param {boolean} [props.allowSpace=true] - Whether to allow spaces in the input.
 * @param {string} [props.valueType] - The type of value (e.g., integer, decimal) for number inputs.
 * @param {boolean} [props.isdisable] - Whether the input is disabled.
 * @param {boolean} [props.isreadonly] - Whether the input is read-only.
 * @param {boolean} [props.issearchable] - Whether the input is searchable.
 */
const Input = ({
    id,
    type = TextInputType.TEXT,
    name = "",
    placeholder = `${name}`,
    value ,
    min,
    max,
    onChange,
    onBlur,
    minLength,
    maxLength,
    cssClass = "input-field",
    allowSpace = true,
    valueType,
    isdisable,
    isreadonly,
    issearchable,
}) => {

    const [inputAttributes, setInputAttributes] = useState({});
    const [selectValue, setSelectValue] = useState(value);
    const [showPassword, setShowPassword] = useState(false);

    const updateAttributes = useCallback(() => {
        const newAttribute = {};

        if (minLength) newAttribute.minLength = minLength;
        if (maxLength) newAttribute.maxLength = maxLength;
        if (isreadonly) newAttribute.readOnly = isreadonly;
        if (type === TextInputType.NUMBER && valueType === NumberValueType.INT) {
            newAttribute.step = 1;
        }

        setInputAttributes(newAttribute);
    }, [minLength, maxLength, type, valueType, isreadonly]);


    const handleInputChange = (e) => {
        let inputValue = e.target.value;

        if (type === TextInputType.NUMBER && maxLength) {
            inputValue = inputValue.slice(0, maxLength);
            e.target.value = inputValue;
        }
        setSelectValue(inputValue)
        onChange(e);
    };

    const handleKeyDown = (e) => {
        if (!allowSpace && e.keyCode === 32) {
            e.preventDefault();
            return;
        }

        if (type === TextInputType.NUMBER && valueType === NumberValueType.INT && excptIntSymbol.includes(e.key)) {
            e.preventDefault();
            return;
        }

        if (type === TextInputType.NUMBER && valueType === NumberValueType.DECIMAL && excptDecimalSymbol.includes(e.key)) {
            e.preventDefault();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    useEffect(() => {
        updateAttributes();
    }, [minLength, maxLength, type, valueType, isreadonly, isdisable, updateAttributes]);

    useEffect(() => {
        setSelectValue(value ?? "")
    }, [value]);

    return (
        <div className="input-group">
            <input
                id={id}
                value={selectValue ?? ""}
                name={name}
                type={type === TextInputType.PASSWORD && showPassword ? TextInputType.TEXT : type}
                className={cssClass}
                placeholder={placeholder}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={onBlur}
                min={min}
                max={max}
                disabled={isdisable && !isreadonly}
                readOnly={isreadonly}
                {...inputAttributes}
            />
            {type === TextInputType.PASSWORD && (
                <span className="input-group-text" role="button" tabIndex={0} onKeyDown={togglePasswordVisibility} onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    <Iconify icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
                </span>
            )}
            {isreadonly && (
                <span className="input-group-text">
                    <Iconify icon="mdi:lock" />
                </span>
            )}
            {issearchable && (
                <span className="input-group-text">
                    <Iconify icon="mdi:search" />
                </span>
            )}
        </div>
    );
};

Input.propTypes = {
    id: PropTypes.string,
    type: PropTypes.oneOf([TextInputType.TEXT, TextInputType.EMAIL, TextInputType.PASSWORD, TextInputType.NUMBER]),
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
    onKeyup: PropTypes.func,
    onBlur: PropTypes.func,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    cssClass: PropTypes.string,
    allowSpace: PropTypes.bool,
    isdisable: PropTypes.bool,
    isreadonly: PropTypes.bool,
    issearchable: PropTypes.bool,
    valueType: PropTypes.oneOf([NumberValueType.INT, NumberValueType.DECIMAL]),
};

export default Input;