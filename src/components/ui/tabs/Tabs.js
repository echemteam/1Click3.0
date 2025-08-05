import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from "react";
import "./Tabs.scss";

const Tabs = ({ tabs, fullWidth = false, variant = "outlined", orientation = "horizontal", color = "primary", }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef([]);
  const indicatorRef = useRef(null);

  const updateIndicator = useCallback(() => {
    const activeTabElement = tabRefs.current[activeTab];
    const indicator = indicatorRef.current;

    if (activeTabElement && indicator) {
      if (orientation === "horizontal") {
        indicator.style.width = `${activeTabElement.offsetWidth}px`;
        indicator.style.left = `${activeTabElement.offsetLeft}px`;
        indicator.style.height = "2px";
        indicator.style.top = "unset";
      } else {
        indicator.style.height = `${activeTabElement.offsetHeight}px`;
        indicator.style.top = `${activeTabElement.offsetTop}px`;
        indicator.style.width = "2px";
        indicator.style.left = "unset";
      }
    }
  }, [activeTab, orientation]);

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      const resizeObserver = new ResizeObserver(() => {
        updateIndicator();
      });
      resizeObserver.observe(activeTabElement);
      return () => resizeObserver.disconnect();
    }
  }, [activeTab, updateIndicator]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [activeTab, tabs, updateIndicator]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateIndicator();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [updateIndicator]);

  const handleTabClick = (tabIndex) => {
    if (!tabs[tabIndex].disabled) {
      setActiveTab(tabIndex);
    }
  };

  return (
    <div className={`tabs-container ${variant} ${orientation} ${color}`}>
      <div className={`tabs-header ${fullWidth ? "full-width" : ""} ${variant} ${orientation} ${color}`}>
        {tabs.map((tab, index) => (
          <div key={index} className="tab-button">
            <button
              className={` 
                ${activeTab === index ? "active" : ""} 
                ${tab.disabled ? "disabled" : ""} 
                ${variant === "contained" ? "contained" : ""} 
              `}
              onClick={() => handleTabClick(index)}
              ref={(el) => (tabRefs.current[index] = el)}
              disabled={tab.disabled}
            >
              <div className="tab-label">{tab.label}</div>
            </button>
          </div>
        ))}
        <div className={`tab-indicator ${variant} ${color}`} ref={indicatorRef}></div>
      </div>
      <div className="tabs-content">{tabs[activeTab] && tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
