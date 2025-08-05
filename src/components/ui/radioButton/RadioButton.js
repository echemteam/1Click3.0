import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import "./RadioButton.scss";

/**
 * RadioButton component represents a customizable radio button with ripple effect.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - The name of the radio button group.
 * @param {string} props.value - The value for the radio button.
 * @param {string} props.label - The label text next to the radio button.
 * @param {boolean} props.defaultChecked - Specifies if the radio button is checked by default.
 * @param {function} props.onChange - Callback function when the radio button state changes.
 * @param {string} props.size - The size of the radio button (default: 20px).
 * @param {string} props.color - The color of the radio button (default: 'primary').
 * @param {boolean} props.disabled - Determines if the radio button is disabled.
 * @param {string} props.labelPosition - Position of the label relative to the radio button (default: 'end').
 * @returns {JSX.Element} - The rendered radio button component.
 */
const RadioButton = ({
  name,
  value,
  label,
  defaultChecked = false,
  onChange,
  size = "20px",
  color = "secondary",
  disabled,
  labelPosition = "end",
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const [showRipple, setShowRipple] = useState(false);

  // Mapping colors to CSS variables
  const colorMap = {
    primary: "#41B2F9",
    secondary: "#045487",
    success: "#62B959",
    error: "#E20C0F",
    warning: "#E14A5C"
  };

  // Determine the selected color based on the provided prop
  const selectedColor = colorMap[color] || colorMap.primary;

  // Update isChecked state if defaultChecked changes
  useEffect(() => {
    setIsChecked(defaultChecked);
  }, [defaultChecked]);

  // Handle state change and trigger ripple effect when clicked
  const handleChange = () => {
    if (!disabled) {
      // Reset ripple before re-triggering it
      setShowRipple(false);

      // Immediately trigger the ripple effect after resetting the state
      setTimeout(() => {
        setShowRipple(true); // Trigger the ripple
      }, 0); // Set a very short timeout to trigger the ripple

      // Update the checked state
      setIsChecked(true);

      // Trigger the onChange callback
      if (onChange) onChange(value);
    }
  };

  return (
    <label
      className={`radio-button radio-button--label-${labelPosition} ${
        disabled ? "radio-button--disabled" : ""
      }`}
    >
      {/* The hidden input for accessibility and form submission */}
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        className="radio-button__input"
        disabled={!!disabled}
      />

      {/* Container for the radio button and ripple effect */}
      <span className="radio-button__container">
        {/* Radio button custom circle */}
        <span
          className="radio-button__custom"
          style={{
            width: size,
            height: size,
            borderColor: disabled ? "$disable-color" : selectedColor,
          }}
        >
          {/* Inner circle (checked state visual) */}
          <span
            className={`radio-button__custom-inner ${isChecked ? "visible" : ""}`}
            style={{
              backgroundColor: disabled ? "$disable-color" : selectedColor,
            }}
          ></span>
        </span>

        {/* Show ripple effect when needed */}
        {showRipple && <span className="radio-button__ripple" />}
      </span>

      {/* Label text */}
      {label && <span className="radio-button__label">{label}</span>}
    </label>
  );
};

// PropTypes for validation
RadioButton.propTypes = {
  name: PropTypes.string.isRequired, // Required string for radio button group name
  value: PropTypes.string.isRequired, // Required string for radio button value
  label: PropTypes.string, // Optional string for the label
  defaultChecked: PropTypes.bool, // Optional boolean for default checked state
  onChange: PropTypes.func, // Optional function for onChange event
  size: PropTypes.string, // Optional string for size (e.g., '20px')
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning']), // Optional string for color
  disabled: PropTypes.bool, // Optional boolean for disabled state
  labelPosition: PropTypes.oneOf(['top', 'bottom', 'start', 'end']), // Optional string for label position
};

export default RadioButton;
