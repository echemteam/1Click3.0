import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Alert.scss";
import Iconify from "../iconify/Iconify";

// Mapping of severity levels to corresponding icons
const severityIcons = {
  success: "lets-icons:check-ring-round",
  warning: "quill:warning",
  error: "material-symbols:error-outline",
  info: "ph:warning-octagon",
};

/**
 * Alert Component
 * 
 * A reusable alert component that displays messages with different severity levels,
 * variants, and an optional close button.
 * 
 * @param {Object} props - Component properties
 * @param {"success" | "warning" | "error" | "info"} [props.severity="info"] - The severity level of the alert
 * @param {"outlined" | "filled" | "default"} [props.variant="default"] - The visual style of the alert
 * @param {string} [props.alertTitle] - Optional title for the alert
 * @param {string} [props.icon] - Optional custom icon for the alert
 * @param {React.ReactNode} props.children - The message/content of the alert
 * @param {boolean} [props.fullWidth=true] - Whether the alert should take full width
 * @param {Function} [props.onClose] - Callback function when the alert is closed
 */
const Alert = ({
  severity = "info",
  variant = "default",
  alertTitle,
  icon,
  children,
  fullWidth = true,
  onClose,
}) => {
  // State to track visibility of the alert
  const [visible, setVisible] = useState(true);

  // Determine which icon to use: custom icon or severity-based default icon
  const iconToUse = icon || severityIcons[severity];

  // If the alert is not visible, do not render anything
  if (!visible) return null;

  return (
    <div className={`alert alert-${severity} alert-${variant} ${fullWidth ? "alert-fullwidth" : ""}`}>
      {/* Icon and content container */}
      <div className="alert-icon-container">
        {iconToUse && <Iconify icon={iconToUse} className={`alert-icon alert-icon-${severity}`} width={25} />}
        <div className="alert-content">
          {alertTitle && <div className="alert-title">{alertTitle}</div>}
          <div className="alert-message">{children}</div>
        </div>
      </div>
      
      {/* Close button container */}
      <div className="alert-close-container">
        {onClose && (
          <button
            className="alert-close"
            onClick={() => {
              setVisible(false);
              onClose();
            }}
          >
            <Iconify icon="ci:close-md" className="alert-close-icon" />
          </button>
        )}
      </div>
    </div>
  );
};

// Define the expected prop types for the Alert component
Alert.propTypes = {
  severity: PropTypes.oneOf(["success", "warning", "error", "info"]),
  variant: PropTypes.oneOf(["outlined", "filled", "default"]),
  alertTitle: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node.isRequired,
  fullWidth: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Alert;