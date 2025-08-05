import React, { useId } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

/**
 * Tooltip component that wraps children and displays a tooltip when hovered over.
 *
 * Renders the tooltip using a portal (on the body), avoiding layout shifts and container scroll issues.
 */
const Tooltip = ({
  label,
  position = "top",
  className = "",
  children,
  variant = "dark",
  opacity = 1,
  delayShow = 0,
  isOpen,
}) => {
  const uniqueId = useId();

  return (
    <>
      <div
        data-tooltip-id={uniqueId}
        data-tooltip-content={label}
        data-tooltip-place={position}
        style={{
          display: "inline-block",
          width: "fit-content",
        }}
      >
        {children}
      </div>

      <ReactTooltip
        id={uniqueId}
        place={position}
        className={className}
        variant={variant}
        opacity={opacity}
        delayShow={delayShow}
        isOpen={isOpen}
        positionStrategy="fixed"
        style={{ zIndex: 9999 }}
      />
    </>
  );
};

export default Tooltip;
