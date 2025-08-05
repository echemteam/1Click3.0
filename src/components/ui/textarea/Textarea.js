import React from "react";
import PropTypes from "prop-types";
import "./Textarea.scss";

/**
 * A simple and styled textarea component.
 *
 * @param {Object} props - Component props.
 * @param {string} props.id - The ID of the textarea.
 * @param {string} props.name - The name of the textarea.
 * @param {string} props.placeholder - Placeholder text.
 * @param {string} props.value - The current value.
 * @param {Function} props.onChange - Change handler.
 * @param {Function} [props.onBlur] - Blur handler.
 * @param {boolean} [props.disabled] - If true, disables the textarea.
 * @param {boolean} [props.readOnly] - If true, makes the textarea read-only.
 * @param {number} [props.rows] - Number of rows.
 * @param {string} [props.cssClass="textarea-field"] - Optional class name.
 */
const Textarea = ({
  id,
  name,
  placeholder = "",
  value = "",
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  rows = 4,
  cssClass = "textarea-field",
}) => {

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="textarea-group">
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        className={cssClass}
      />
    </div>
  );
};

Textarea.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  rows: PropTypes.number,
  cssClass: PropTypes.string,
};

export default Textarea;
