/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import "./HoverBox.scss";

/**
 * HoverBox Component
 *
 * Displays a hoverable content box next to a trigger element.
 * - `vertDirection`: Determines the vertical position (`above` or `below`)
 * - `horizDirection`: Determines the horizontal position (`left` or `right`)
 * - Adjusts dynamically to stay within the viewport.
 */

const HoverBox = ({
  children,
  hoverContent,
  boxStyleClassName,
  vertDirection = "below",
  horizDirection = "right",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const [portalContainer, setPortalContainer] = useState(null);

  const triggerRef = useRef(null);
  const hoverBoxRef = useRef(null);

  // Create portal container on mount
  useEffect(() => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  // Function to get preferred position based on directions
  const getPreferredPosition = (triggerRect, hoverBoxRect) => {
    let top, left;

    // Calculate vertical position
    if (vertDirection === "above") {
      top = triggerRect.top - hoverBoxRect.height - 10; // 10px offset
    } else {
      // below
      top = triggerRect.bottom + 10; // 10px offset
    }

    // Calculate horizontal position
    if (horizDirection === "left") {
      // For left direction, align right edge of hover box with left edge of trigger
      left = triggerRect.left - hoverBoxRect.width;
    } else {
      // For right direction, align left edge of hover box with right edge of trigger
      left = triggerRect.right;
    }

    return { top, left };
  };

  const calculateHoverBoxPosition = () => {
    if (triggerRef.current && hoverBoxRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const hoverBoxRect = hoverBoxRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Get preferred position
      let { top, left } = getPreferredPosition(triggerRect, hoverBoxRect);

      // Adjust for vertical overflow
      if (top < 0) {
        top = triggerRect.bottom + 10; // Move below if above overflows
      } else if (top + hoverBoxRect.height > viewportHeight) {
        top = triggerRect.top - hoverBoxRect.height - 10; // Move above if below overflows
      }

      // Adjust for horizontal overflow
      if (horizDirection === "left") {
        // For left direction, if it would overflow left edge, flip to right
        if (left < 0) {
          left = triggerRect.right;
        }
      } else {
        // For right direction, if it would overflow right edge, flip to left
        if (left + hoverBoxRect.width > viewportWidth) {
          left = triggerRect.left - hoverBoxRect.width;
        }
      }

      setHoverPosition({ top, left });
    }
  };

  // Effect to handle positioning and add listeners for dynamic adjustment
  useEffect(() => {
    if (isHovered) {
      calculateHoverBoxPosition();
      window.addEventListener("scroll", calculateHoverBoxPosition, true);
      window.addEventListener("resize", calculateHoverBoxPosition);

      return () => {
        window.removeEventListener("scroll", calculateHoverBoxPosition, true);
        window.removeEventListener("resize", calculateHoverBoxPosition);
      };
    }
  }, [isHovered, vertDirection, horizDirection]);

  const renderHoverContent = () => {
    if (!portalContainer) return null;

    return createPortal(
      <div
        ref={hoverBoxRef}
        className={`hover-box-content ${boxStyleClassName}`}
        style={{
          position: "fixed",
          top: hoverPosition.top,
          left: hoverPosition.left,
          zIndex: 9999,
        }}
      >
        {hoverContent}
      </div>,
      portalContainer
    );
  };

  return (
    <div
      className="hover-box-container"
      ref={triggerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trigger Element */}
      <div className="hover-box-trigger">{children}</div>

      {isHovered && renderHoverContent()}
    </div>
  );
};

// Prop types for HoverBox
HoverBox.propTypes = {
  children: PropTypes.node.isRequired,
  hoverContent: PropTypes.node.isRequired,
  boxStyleClassName: PropTypes.string,
  vertDirection: PropTypes.oneOf(["above", "below"]),
  horizDirection: PropTypes.oneOf(["left", "right"]),
};

// Default props
HoverBox.defaultProps = {
  boxStyleClassName: "",
  vertDirection: "below",
  horizDirection: "right",
};

export default HoverBox;
