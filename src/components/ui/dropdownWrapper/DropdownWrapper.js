import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import "./DropdownWrapper.scss";

// Custom hook for managing the dropdown's state and position
const useDropdown = (direction = "right", gap = 4) => {
  const [isOpen, setIsOpen] = useState(false); // Tracks whether the dropdown is open or closed
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 }); // Stores dropdown position
  const dropdownRef = useRef(null); // Ref for the dropdown content
  const toggleElementRef = useRef(null); // Ref for the element that triggers the dropdown

  // Function to toggle the dropdown's open/closed state
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to close the dropdown
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handles clicks outside of the dropdown to close it
  const handleOutsideClick = useCallback((e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      toggleElementRef.current &&
      !toggleElementRef.current.contains(e.target)
    ) {
      closeDropdown();
    }
  }, [closeDropdown, toggleElementRef, dropdownRef]);

  // Updates the dropdown position to avoid overflow on the screen
  const updateDropdownPosition = useCallback(() => {
    if (toggleElementRef.current && dropdownRef.current) {
      const toggleRect = toggleElementRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = toggleRect.bottom + gap; // Apply gap + // Ensure dropdown starts from the bottom edge
      let left = toggleRect.left; // Align with the left edge of the toggle element

      // Check the direction and adjust accordingly
      if (direction === "right") {
        left = toggleRect.left; // Align with toggle element
        if (toggleRect.left + dropdownRect.width > viewportWidth) {
          left = toggleRect.right - dropdownRect.width; // Adjust if overflowing
        }
      } else if (direction === "left") {
        left = toggleRect.right - dropdownRect.width; // Align to the left of toggle element
        if (left < 0) {
          left = toggleRect.left; // Adjust if overflowing
        }
      }

      // Adjust position if dropdown overflows at the bottom
      if (toggleRect.bottom + dropdownRect.height + gap > viewportHeight) {
        top = toggleRect.top - dropdownRect.height - gap; // Apply gap above if no space below
      }

      // Prevent dropdown from overflowing on the top
      if (top < 0) {
        top = toggleRect.bottom + gap;
      }

      setDropdownPosition({ top, left });
    }
  }, [toggleElementRef, dropdownRef, direction, gap]);

  // Event listener to close dropdown if clicked outside
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, handleOutsideClick]);

  // Update dropdown position when it is opened or when scrolling occurs
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();

      // Add scroll event listener to update position dynamically
      const handleScroll = () => {
        updateDropdownPosition();
      };

      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  // Update position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, updateDropdownPosition]);

  // Close dropdown if the parent element goes out of view
  useEffect(() => {
    const element = toggleElementRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          closeDropdown(); // Close the dropdown if the parent is not visible
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );

    if (toggleElementRef.current) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [toggleElementRef, closeDropdown]);

  // Return values and functions to control dropdown behavior
  return {
    isOpen,
    toggleDropdown,
    closeDropdown,
    dropdownRef,
    toggleElementRef,
    dropdownPosition,
  };
};

// DropdownWrapper component to render the dropdown toggle button and dropdown content
const DropdownWrapper = ({
  children,
  toggleElement,
  className,
  direction = "right",
  gap = 4,
}) => {
  const {
    isOpen,
    toggleDropdown,
    dropdownRef,
    toggleElementRef,
    closeDropdown,
    dropdownPosition,
  } = useDropdown(direction, gap); // Pass direction prop to the hook

  // Handle click on children to close the dropdown
  const handleChildClick = () => {
    closeDropdown(); // Close the dropdown when any child is clicked
  };

  return (
    <div className="dropdown-wrapper">
      <button
        ref={toggleElementRef}
        onClick={toggleDropdown}
        className="dropdownwrapper-toggle"
      >
        {toggleElement}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`dropdownwrapper-content ${className}`}
          style={{
            position: "fixed",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
          }}
        >
          <div onClick={handleChildClick}>{children}</div>
        </div>
      )}
    </div>
  );
};

// PropTypes validation for DropdownWrapper
DropdownWrapper.propTypes = {
  children: PropTypes.node.isRequired, // Dropdown content (can be any renderable React node)
  toggleElement: PropTypes.node.isRequired, // Element that triggers the dropdown
  direction: PropTypes.oneOf(["left", "right"]), // Direction the dropdown should open
  gap: PropTypes.number, // Gap between the dropdown and the toggle element
};

DropdownWrapper.defaultProps = {
  direction: "right", // Default to opening to the right
  gap: 4, // Default gap between the dropdown and the toggle element
};

// Export the hook and component
export { useDropdown, DropdownWrapper };
