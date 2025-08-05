import React, { useEffect, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Iconify from "../iconify/Iconify";
import "./SidebarModal.scss";

/**
 * SidebarModal Component
 *
 * A modal that displays content in a sidebar with transition effects and customizable position.
 *
 * @param {boolean} isOpen - Determines if the modal is open or closed.
 * @param {function} onClose - Callback function to close the modal.
 * @param {JSX.Element} children - Content to display inside the modal.
 * @param {string} modalTitle - Title of the modal.
 * @param {string} modalSize - Modal width size (default is "w-45" for 45% width).
 * @param {string} defaultPosition - Initial position of the modal, either "left" or "right" (default is "right").
 * @param {boolean} showToggle - Determines whether to show the position toggle (left/right).
 * @param {string} className - Custom className to pass to the modal.
 * @returns JSX Element
 */
const SidebarModal = ({
  modalTitle,
  onClose,
  isOpen,
  showToggle,
  children,
  defaultPosition = "right", // Default position of the modal (left or right)
  modalSize = "w-45", // Default modal size (width percentage)
  className = " ", // Additional class names for customization
  backdropClosable = true,  // Control backdrop click behavior
  ...props
}) => {
  // State to handle position of the modal (right or left)
  const [isRightPosition, setIsRightPosition] = useState(
    defaultPosition === "right"
  );

  // State to control modal visibility with smooth transition effects
  const [isVisible, setIsVisible] = useState(false);

  // State to control whether the modal is displayed in the DOM
  const [showModal, setShowModal] = useState(isOpen);

  // Ensure portal renders only on client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dynamically calculate modal width based on modalSize prop
  const calculateDynamicPosition = useMemo(() => {
    const classWidth = modalSize.split("-")[1];
    const percentage = classWidth ? parseInt(classWidth) : 40; // Default width is 40% if no specific size is given
    return percentage;
  }, [modalSize]);

  // Effect to handle modal opening and closing transitions
  useEffect(() => {
    if (isOpen) {
      // Show the modal after a slight delay to trigger the opening animation
      setShowModal(true);
      setTimeout(() => setIsVisible(true), 50); // 50ms delay before transition starts
    } else {
      setIsVisible(false);
      // Remove modal from DOM after transition (500ms matches the transition duration)
      setTimeout(() => setShowModal(false), 500);
    }
  }, [isOpen]);

  // Effect to handle changes in the modal position (left or right)
  useEffect(() => {
    setIsRightPosition(defaultPosition === "right");
  }, [defaultPosition]);

  // Effect to Close the modal when pressed the escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose(); // Close the modal when "Escape" is pressed
      }
    };

    // Add event listener when the modal is open
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup event listener when modal is closed or component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  
    // Cleanup in case the component unmounts while still open
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);
  

  // Handler to toggle modal position (switch between left and right)
  const handleTogglePosition = () => {
    setIsRightPosition((prev) => !prev); // Toggle between true (right) and false (left)
  };

  // Backdrop click handler
  const handleBackdropClick = () => {
    if (backdropClosable) {
      onClose();
    }
  };

  // Calculate the remaining percentage for positioning when the modal is on the right
  const remainingPosition = 100 - calculateDynamicPosition;

  // Modal content rendering
  const modalContent = showModal && (
    <>
      {/* Backdrop layer to close the modal when clicked */}
      <div
        className={`sidebar-modal-backdrop ${className}`}
        onClick={handleBackdropClick}
      ></div>

      {/* Sidebar modal with dynamic position, size, and transition classes */}
      <div
        className={`sidebar-modal ${className} transition-wrapper ${
          isRightPosition ? "right-position" : "left-position"
        } ${isVisible ? "open" : "close"} ${modalSize}`}
        style={{
          width: `${calculateDynamicPosition}%`, // Set modal width dynamically
          left: isRightPosition ? `${remainingPosition}%` : "0", // Position modal on the left or right
          right: isRightPosition ? "0" : `${remainingPosition}%`, // Position modal on the right or left
        }}
      >
        {/* Modal header with title and close button */}
        <div className="sidebar-modal-header">
          <h2>{modalTitle}</h2>

          {/* Toggle switch to move the modal left or right */}
          {showToggle && (
            <div className="toggle-switch-wrapper">
              <span className="toggle-label">
                {isRightPosition ? "Move to Left" : "Move to Right"}
              </span>
              <div
                className={`toggle-switch ${isRightPosition ? "active" : ""}`}
                onClick={handleTogglePosition}
              />
            </div>
          )}

          {/* Close button to close the modal */}
          <button className="close-button" onClick={onClose}>
            <Iconify icon="gg:close-o" width={25} />
          </button>
        </div>

        {/* Modal content area for children components */}
        <div className="sidebar-modal-content">{children}</div>
      </div>
    </>
  );

  // Only render portal on client
  if (!isClient) return null;
  // Render the modal into the body using React Portal for outside DOM placement
  return ReactDOM.createPortal(modalContent, document.body);
};

// Prop types for type-checking and validation
SidebarModal.propTypes = {
  modalTitle: PropTypes.string.isRequired, // Modal title is required
  modalSize: PropTypes.string, // Modal size is optional
  onClose: PropTypes.func.isRequired, // onClose function is required
  isOpen: PropTypes.bool.isRequired, // isOpen is required to control visibility
  children: PropTypes.node, // Children are optional to render custom content
  showToggle: PropTypes.bool, // Toggle position feature is optional
  defaultPosition: PropTypes.string, // Initial position of the modal (left or right)
  className: PropTypes.string, // Custom class names for styling
};

export default SidebarModal;
