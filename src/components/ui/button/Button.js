import React, { useState } from "react";
import PropTypes from "prop-types";
import Iconify from "../iconify/Iconify";
import "./Button.scss";

/**
 * 
 * @param {string} variant - The button variant (e.g., "contained", "outlined").
 * @param {string} color - The button color (e.g., "primary", "secondary", etc.).
 * @param {React.ReactNode} children - Content of the button.
 * @param {string} href - Optional URL for the link version of the button.
 * @param {boolean} disabled - Disables the button if true.
 * @param {boolean} disableElevation - Disables the elevation effect if true.
 * @param {function} onClick - Callback function to be called on button click.
 * @param {string} startIcon - Icon to be displayed at the start of the button.
 * @param {string} endIcon - Icon to be displayed at the end of the button.
 * @param {boolean} loading - If true, shows a loading spinner inside the button.
 * @param {string} loadingPosition - Position of the loading spinner (start, middle, or end).
 * @param {string} className - can give classname to customise it further.
 */
const Button = ({
  variant = "contained", // Default is "contained"
  color = "primary", // Default is "primary"
  children,
  href,
  disabled,
  disableElevation,
  onClick,
  startIcon,
  endIcon,
  loading,
  loadingPosition = "start", // Default is "start"
  className = "",
  type,
  ...props
}) => {
  const [ripples, setRipples] = useState([]); // Store ripples for the ripple effect

  /**
   * Handles the button click event.
   * Triggers a ripple effect and calls the onClick callback if the button is not disabled or loading.
   */
  const handleClick = (event) => {
    if (disabled || loading) {
      return;
    }

    // Get button dimensions for the ripple effect
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // Create a new ripple effect and add it to the state
    const newRipple = {
      id: Date.now(),
      style: {
        width: size,
        height: size,
        top: y,
        left: x,
      },
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove the ripple after a delay
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 500);

    // Call the onClick callback if it's provided
    setTimeout(() => {
      if (onClick) {
        onClick(event);
      }
    }, 0);
  };

  // Define button classes based on the props
  const buttonClasses = `button button--${variant} button--${color} ${
    disabled || loading ? "button--disabled" : ""
  } ${disableElevation ? "button--disable-elevation" : ""}`;

  // Render an icon with the Iconify component
  const renderIcon = (icon) => (
    <Iconify icon={icon} className="button__icon" width={20} />
  );

  // Render the loading spinner icon with special handling for the "middle" position
  const renderLoading = () => (
    <Iconify
      icon="svg-spinners:180-ring-with-bg"
      className={`button__loading-icon ${
        loadingPosition === "middle" ? "button__loading-icon--middle" : ""
      }`}
      width={20}
    />
  );

  /**
   * Renders the content inside the button, including loading state and icons.
   */
  const renderContent = () => (
    <>
      {/* Show the loading spinner if loading is true */}
      {loading && loadingPosition === "start" && renderLoading()}
      {/* Display start icon if available */}
      {!loading && startIcon && renderIcon(startIcon)}
      {/* Button content (text) */}
      <span
        className={`button__content ${
          loading && loadingPosition === "middle" ? "button__content--hidden" : ""
        }`}
      >
        {children}
      </span>
      {/* Show the loading spinner at the end if loadingPosition is "end" */}
      {loading && loadingPosition === "end" && renderLoading()}
      {/* Display end icon if available */}
      {!loading && endIcon && renderIcon(endIcon)}
      {/* Display loading spinner in the middle if loadingPosition is "middle" */}
      {loading && loadingPosition === "middle" && renderLoading()}
    </>
  );

  // If href is provided, render as a link <a>
  if (href) {
    return (
      <a
        className={`${buttonClasses} ${className}`}
        href={href}
        {...props}
        onClick={disabled || loading ? (e) => e.preventDefault() : handleClick}
      >
        {renderContent()}
        {/* Render ripple effect */}
        <div className="button__ripple-container">
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="button__ripple"
              style={ripple.style}
            />
          ))}
        </div>
      </a>
    );
  }

  // Otherwise, render as a button <button>
  return (
    <button
      className={`${buttonClasses} ${className}`}
      {...props}
      onClick={disabled || loading ? (e) => e.preventDefault() : handleClick}
      type={type}
    >
      {renderContent()}
      {/* Render ripple effect */}
      <div className="button__ripple-container">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="button__ripple"
            style={ripple.style}
          />
        ))}
      </div>
    </button>
  );
};

// PropTypes to validate the props passed to the Button component
Button.propTypes = {
  variant: PropTypes.oneOf(["text", "contained", "outlined"]), // Button style (e.g., filled, outlined, etc.)
  color: PropTypes.oneOf([ // Button color variants
    "primary", "secondary", "error", "success", "info", "warning",
  ]),
  children: PropTypes.node.isRequired, // Button content (text or elements)
  href: PropTypes.string, // URL for the link version of the button
  disabled: PropTypes.bool, // Disable the button if true
  disableElevation: PropTypes.bool, // Remove elevation if true
  onClick: PropTypes.func, // Callback when button is clicked
  startIcon: PropTypes.string, // Icon at the start of the button
  endIcon: PropTypes.string, // Icon at the end of the button
  loading: PropTypes.bool, // Show loading spinner if true
  loadingPosition: PropTypes.oneOf(["start", "middle", "end"]), // Position of the loading spinner
  className: PropTypes.string, // Additional class names for the button
  type: PropTypes.string, // Type of the button (e.g., "submit", "reset", "button")
};

export default Button;
