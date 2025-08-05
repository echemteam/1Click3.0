import React from "react";
import PropTypes from "prop-types";
import Iconify from "../iconify/Iconify";
import "./IconButton.scss";

/**
 * IconButton component with support for loading state and optional link behavior.
 *
 * @param {string} icon - The icon to display inside the button.
 * @param {function} onClick - Callback function to be executed on click.
 * @param {boolean} disabled - Disables the button if true.
 * @param {boolean} loading - Shows a loading spinner if true.
 * @param {string} variant - The button variant ("text", "contained", "outlined").
 * @param {string} color - The button color ("primary", "secondary", etc.).
 * @param {string} size - The size of the button ("small", "medium", "large").
 * @param {boolean} disableElevation - Removes elevation if true.
 * @param {string} href - URL to navigate to when the button is clicked (renders as an <a> tag if provided).
 * @param {string} className - Additional class names for the button.
 * @param {string} shape - Shape of the button ("round" or "square").
 * @param {object} props - Additional props passed to the button.
 */
const IconButton = ({
  icon,
  onClick,
  disabled = false,
  loading = false,
  variant = "contained",
  color = "primary",
  size = "medium",
  disableElevation = false,
  href,
  className = "",
  shape = "square",
  ...props
}) => {
  // Generate class names dynamically based on props
  const classNames = [
    "icon-button",
    `icon-button--${shape}`,
    `icon-button--${variant}`,
    `icon-button--${variant}--${color}`,
    `icon-button--${size}`,
    disableElevation && "icon-button--no-elevation",
    (disabled || loading) && "icon-button--disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Render loading spinner
  const renderLoading = () => (
    <Iconify
      icon="svg-spinners:180-ring-with-bg"
      className="icon-button__loading-icon"
      width={24}
    />
  );

  // Render the icon
  const renderIcon = () => (
    loading ? renderLoading() : <Iconify icon={icon} className="icon-button__icon" width={20} />
  );

  // Render as an <a> tag if href is provided
  if (href) {
    return (
      <a
        className={classNames}
        href={href}
        onClick={!disabled && !loading ? onClick : (e) => e.preventDefault()}
        {...props}
      >
        {renderIcon()}
      </a>
    );
  }

  // Render as a <button> tag if no href is provided
  return (
    <button
      className={classNames}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      {...props}
    >
      {renderIcon()}
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.string.isRequired, // The icon to display in the button
  onClick: PropTypes.func, // Callback function for button click
  disabled: PropTypes.bool, // Disable the button if true
  loading: PropTypes.bool, // Show loading spinner if true
  variant: PropTypes.oneOf(["text", "contained", "outlined"]), // Button style variant
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "error",
    "info",
    "warning",
  ]), // Button color variant
  size: PropTypes.oneOf(["small", "medium", "large"]), // Button size
  disableElevation: PropTypes.bool, // Remove button elevation if true
  href: PropTypes.string, // URL for link behavior
  className: PropTypes.string, // Additional class names for the button
};

export default IconButton;
