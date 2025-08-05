import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Icon } from "@iconify/react";

/**
 * Iconify component - A wrapper around Iconify's Icon component with additional customization options.
 *
 * @param {React.Element|string} icon - The icon to be displayed (can be an element or string for the Iconify library).
 * @param {number} width - The width and height of the icon (applies equal dimensions for square icons).
 * @param {object} style - Custom inline styles for the component container.
 * @param {string} className - Additional class names for customization.
 * @param {string} altText - Fallback text displayed when no icon is provided.
 * @param {object} other - Additional props to pass to the container div.
 * @param {React.Ref} ref - Ref passed to the component for DOM access.
 */
const Iconify = forwardRef(
  ({ icon, width = 20, style, className = "", altText = "icon", ...other }, ref) => {
    return (
      <div
        ref={ref} // Attach the forwarded ref to the container div
        className={`component-iconify ${className}`} // Default and custom class names
        style={{
          width, // Set width of the container
          height: width, // Set height equal to width for square icons
          display: "flex", // display with flex properties for centering
          justifyContent: "center", // Center content horizontally
          alignItems: "center", // Center content vertically
          ...style, // Merge additional inline styles
        }}
        {...other} // Spread additional props onto the container div
      >
        {icon ? (
          // Render the provided icon
          <Icon icon={icon} width={width} height={width} />
        ) : (
          // Fallback content when no icon is provided
          <div
            style={{
              width, // Fallback width
              height: width, // Fallback height
              display: "flex", // Flex properties for centering fallback text
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {altText} {/* Display fallback text */}
          </div>
        )}
      </div>
    );
  }
);

Iconify.displayName = "Iconify";

// Define prop types for the Iconify component
Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]), // Icon element or string
  style: PropTypes.object, // Inline styles for the container
  width: PropTypes.number, // Size of the icon (applies to both width and height)
  className: PropTypes.string, // Additional class names for styling
  altText: PropTypes.string, // Fallback text if no icon is provided
};

// Export the Iconify component
export default Iconify;
