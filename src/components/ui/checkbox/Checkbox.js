import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Checkbox.scss";
import Iconify from "../iconify/Iconify";

/**
 * Checkbox component with size, color, and other props for customization.
 *
 * @param {string} label - The label text for the checkbox.
 * @param {boolean} checked - Determines if the checkbox is checked.
 * @param {function} onChange - Callback function when checkbox state changes.
 * @param {boolean} disabled - Determines if the checkbox is disabled.
 * @param {boolean} required - If true, a required asterisk is shown next to the label.
 * @param {boolean} defaultChecked - The default checked state of the checkbox.
 * @param {boolean} disableChecked - If true, disables the checked state change.
 * @param {string} size - The size of the checkbox ("small", "medium", "large").
 * @param {string} color - The color of the checkbox ("primary", "secondary", "success", "error", "warning").
 * @param {string} labelPosition - Position of the label ("top", "bottom", "left", "right").
 * @param {string} className - can give classname to customise it further.
 */
const Checkbox = ({
  label,
  checked,
  onChange,
  disabled,
  required,
  defaultChecked,
  disableChecked,
  size = "medium",
  color = "primary",
  labelPosition = "right",
  className = "",
}) => {
  const [isChecked, setIsChecked] = useState(
    defaultChecked || checked || false
  );
  const [showRipple, setShowRipple] = useState(false);

  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleChange = () => {
    if (disabled || disableChecked) return;

    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 300);

    setIsChecked(!isChecked);
    onChange && onChange(!isChecked);
  };

  return (
    <div
      className={`checkbox-container ${disabled ? "disabled" : ""} ${labelPosition} ${className}`}
      onClick={!disabled ? handleChange : undefined}
    >
      <div
        className={`checkbox ${isChecked ? "checked" : ""} ${
          disabled ? "disabled" : ""
        } ${size} ${color}`}
      >
        {showRipple && <span className="ripple" />}
        <div className="checkbox-inner">
          {isChecked && (
            <Iconify icon="material-symbols:check" className="checkmark" />
          )}
        </div>
      </div>
      {label && (
        <label className="checkbox-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  disableChecked: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "error",
    "warning",
  ]),
  labelPosition: PropTypes.oneOf(["top", "bottom", "left", "right"]), 
};

export default Checkbox;