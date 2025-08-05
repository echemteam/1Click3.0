import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './CenterModal.scss';
import Iconify from '../iconify/Iconify';
import PropTypes from 'prop-types';

/**
 * CenterModal Component
 * 
 * A modal that displays content at the center of the screen with various transition effects.
 * 
 * @param {boolean} isOpen - Determines if the modal is open or closed.
 * @param {function} onClose - Callback function to close the modal.
 * @param {JSX.Element} children - Content to display inside the modal.
 * @param {string} modalTitle - Title of the modal.
 * @param {string} modalSize - Modal width size (default is "w-45" for 45% width).
 * @param {string} transition - Defines the transition effect for the modal (default is "slideIn").
 * @param {string} transitionDirection - Direction of the transition effect (default is "fromBottom").
 * @param {string} className - To pass a custom className to the modal.
 * @returns JSX Element
 */
const CenterModal = ({
  isOpen,
  onClose,
  children,
  modalTitle,
  modalSize = 'w-45',
  transition = 'grow',
  transitionDirection = 'fromBottom',
  className = " ",
}) => {
  // State to manage whether the modal is rendered in the DOM
  const [showModal, setShowModal] = useState(isOpen);

  // Effect to handle opening and closing of the modal with transition effects
  useEffect(() => {
    if (isOpen) {
      // Show modal after a slight delay to trigger the opening transition
      setShowModal(true);
    } else {
      // Remove modal from DOM after a transition (400ms duration)
      setTimeout(() => setShowModal(false), 400); // Delay to trigger the closing transition
    }
  }, [isOpen]);

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
  

  // Return null if the modal is not visible to prevent rendering
  if (!showModal) return null;

  // Extract modal width from the modalSize prop (default is 45%)
  const widthMatch = modalSize.match(/w-(\d+)/);
  const modalWidth = widthMatch ? `${widthMatch[1]}%` : '45%'; // Default to 45% if no specific width is given
  const modalStyle = { width: modalWidth }; // Set the modal width style dynamically

  // Determine the transition effect class based on the transition type and direction
  let transitionClass = '';
  if (transition === 'grow') {
    // Use grow-in or grow-out based on the modal's open state
    transitionClass = isOpen ? 'grow-in' : 'grow-out';
  } 
  else if (transition === 'bounce'){
    transitionClass = isOpen ? 'bounce-in' : 'bounce-out';
  }
  else {
    // Apply transition based on the specified type and direction (e.g., slide-in, fromBottom)
    transitionClass = isOpen
      ? `${transition}-${transitionDirection}`
      : `${transition}-out-${transitionDirection}`;
  }

  // Modal content structure including header, close button, and body
  const modalContent = (
    <div
      className={`center-modal ${transitionClass}`} // Apply transition effect class
      style={modalStyle} // Apply modal width
      onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside
    >
      {/* Modal Header with title and close button */}
      <div className="center-modal-header">
        <h2>{modalTitle}</h2>
        <button className="close-button" onClick={onClose}>
          <Iconify icon="pajamas:close" width={24} /> {/* Close icon */}
        </button>
      </div>

      {/* Modal Body to display the content (children) */}
      <div className="center-modal-body">{children}</div>
    </div>
  );

  // Overlay to cover the background and handle click to close
  const modalOverlay = (
    <div className={`center-modal-overlay ${className}`} onClick={onClose}>
      {modalContent}
    </div>
  );

  // Render the modal using React Portal, which allows it to be placed outside of the DOM hierarchy of its parent
  return ReactDOM.createPortal(
    <div data-modal-root>{modalOverlay}</div>,
    document.body
  );
};

// PropTypes for type checking and validation
CenterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,           // Whether the modal is open or closed
  onClose: PropTypes.func.isRequired,          // Function to handle modal closing
  children: PropTypes.node,                    // Content inside the modal
  modalTitle: PropTypes.string.isRequired,     // Title of the modal
  modalSize: PropTypes.string,                 // Size of the modal (e.g., 'w-45')
  transition: PropTypes.string,                // Type of transition effect (e.g., 'slideIn')
  transitionDirection: PropTypes.string,       // Direction of the transition (e.g., 'fromBottom')
  className: PropTypes.string,                 // Custom class for styling
};

export default CenterModal;
