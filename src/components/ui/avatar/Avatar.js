import React, { useState } from "react";
import PropTypes from "prop-types";
import Iconify from "../../ui/iconify/Iconify"; // Iconify component for rendering icons
import "./Avatar.scss"; // Avatar-specific styles
/**
 * Avatar Component
 *
 * A versatile avatar component for displaying images, initials, or icons.
 * Handles fallback cases for broken images or when no image source is provided.
 *
 * @param {string} src - URL for the avatar image.
 * @param {string} alt - Alt text for the avatar. If provided, it is used to generate initials when no image or icon is provided.
 * @param {string} size - Size of the avatar. Can be "small", "medium", or "large".
 * @param {string} shape - Shape of the avatar. Can be "circle" or "square".
 * @param {string} bgcolor - Background color for the avatar when displaying initials or as a fallback.
 * @param {string} gradient - Background gradient for the avatar when displaying initials or as a fallback.
 * @param {string} icon - Icon name from Iconify to display inside the avatar. Takes precedence over initials.
 * @returns {JSX.Element} Rendered avatar component.
 */
const Avatar = ({
  src,
  alt,
  size,
  shape,
  bgcolor,
  gradient,
  icon,
}) => {
  const [imgError, setImgError] = useState(false); // Tracks if the image fails to load

  // Determine background style based on gradient or solid color
  const style = gradient
    ? { background: gradient }
    : bgcolor
    ? { backgroundColor: bgcolor }
    : {};

  return (
    <>
      <div>
        {imgError || !src ? ( // Render fallback content if image fails to load or no src is provided
          <div
            className={`avatar alt-avatar ${size} ${shape}`}
            style={style}
            data-tooltip-id={alt} // Tooltip for accessibility or additional info
          >
            {icon ? (
              // Render icon if the `icon` prop is provided
              <Iconify icon={icon} style={{ color: "#fff" }} width={20} />
            ) : alt ? (
              // Render initials if `alt` text is provided
              getInitials(alt)
            ) : (
              // Default fallback content
              "U"
            )}
          </div>
        ) : (
          // Render image if `src` is valid
          <img
            className={`avatar ${size} ${shape}`}
            src={src}
            alt={alt || "Avatar"} // Use alt text or default to "Avatar"
            onError={() => setImgError(true)} // Set imgError if the image fails to load
          />
        )}
      </div>
    </>
  );
};

/**
 * Utility Function: getInitials
 *
 * Generates initials from a given string (e.g., a full name).
 *
 * @param {string} str - Input string to extract initials from.
 * @returns {string} Initials extracted from the string.
 */
const getInitials = (str) => {
  if (!str) return "U"; // Default to "U" if no valid string is provided
  const words = str
    .split(" ") // Split the string into words
    .filter((word) => word.length > 0); // Exclude empty strings

  return (
    words
      .slice(0, 2) // Take up to the first two words
      .map((word) => word[0].toUpperCase()) // Convert first letter of each word to uppercase
      .join("") || "U"
  ); // Join the initials or default to "U"
};

// PropTypes for Avatar Component
Avatar.propTypes = {
  /** URL for the avatar image. */
  src: PropTypes.string,

  /** Alt text for the avatar. Used to generate initials or for accessibility. */
  alt: PropTypes.string,

  /** Size of the avatar: "small", "medium", or "large". */
  size: PropTypes.oneOf(["small", "medium", "large"]),

  /** Shape of the avatar: "circle" or "square". */
  shape: PropTypes.oneOf(["circle", "square"]),

  /** Solid background color for the avatar. */
  bgcolor: PropTypes.string,

  /** Gradient background color for the avatar. Takes precedence over `bgcolor`. */
  gradient: PropTypes.string,

  /** Icon name from Iconify to render inside the avatar. */
  icon: PropTypes.string,
};

// Default Props for Avatar Component
Avatar.defaultProps = {
  alt: "U", // Default fallback for alt text
  size: "medium", // Default size
  shape: "circle", // Default shape
};

export default Avatar;
