import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "./Select.scss";
import Iconify from "../iconify/Iconify";

/**
 * Select Component
 * A customizable dropdown component with support for search, multiple selection, and tags.
 **/

const Select = ({
  options, // Array of options for the dropdown
  disabled = false, // Determines if the dropdown is disabled
  placeholder = "Select", // Placeholder text for the dropdown
  onChange, // Callback function to handle value changes
  isSearchable = false, // Enables the search functionality
  multiple = false, // Enables multiple selection
  limitTags = 2, // Maximum number of tags to display before showing "+X more"
  defaultOption = null, // Default selected option(s)
  onBlur, // Callback function to handle blur event
  value = undefined, // Value of the selected option(s)
}) => {
  // State variables
  const [isOpen, setIsOpen] = useState(false); // Tracks if the dropdown is open
  const [selectedOptions, setSelectedOptions] = useState(
    multiple
      ? defaultOption || [] // Initialize with array if multiple selection
      : defaultOption
        ? [defaultOption] // Wrap default option in array for single selection
        : []
  );
  const [searchQuery, setSearchQuery] = useState(""); // Tracks search query input
  const [filteredOptions, setFilteredOptions] = useState(options); // Filtered list of options
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 }); // Dropdown positioning

  // Refs for managing DOM elements
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  /**
   * Updates the search query and filters the options based on input.
   */

  const handleSearchChange = (e) => {
    const query = e.target.value; // Keep the input value as it is
    setSearchQuery(query); // Set the search query directly without converting it to lowercase
    setFilteredOptions(
      options.filter(
        (option) => option.label.toLowerCase().includes(query.toLowerCase()) // Perform case-insensitive comparison here
      )
    );
    if (!isOpen) setIsOpen(true); // Open dropdown when typing
    calculateDropdownPosition(); // Calculate dropdown position when typing
  };

  /**
   * Resets the filtered options when the options prop changes.
   */

  useEffect(() => {
    setFilteredOptions(options); // Reset filtered options when options change
  }, [options]);

  // Filter out already selected options if multiple selection is enabled
  const availableOptions = multiple
    ? filteredOptions.filter(
      (option) =>
        !selectedOptions.some((selected) => selected.value === option.value)
    )
    : filteredOptions;

  /**
   * Toggles the dropdown open or closed.
   */
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (isSearchable && !isOpen) {
        setTimeout(() => {
          searchInputRef.current && searchInputRef.current.focus();
        }, 0);
      }
    }
  };

  /**
   * Clears the selected options and resets search query.
   */
  const handleClear = () => {
    setSelectedOptions(multiple ? [] : []); // Clear selected options
    setSearchQuery(""); // Clear the search input (if searchable)
    onChange(multiple ? [] : null); // Update the parent component
  };

  /**
   * Handles selection or deselection of an option.
   */
  const handleOptionClick = (option) => {
    const currentSelection = selectedOptions || []; // Ensure selectedOptions is an array
    if (multiple) {
      if (
        currentSelection.some((selected) => selected.value === option.value)
      ) {
        // Remove if already selected
        const updatedOptions = currentSelection.filter(
          (selected) => selected.value !== option.value
        );
        setSelectedOptions(updatedOptions);
        onChange(updatedOptions.map((opt) => opt.value));
      } else {
        // Add new option
        const updatedOptions = [...currentSelection, option];
        setSelectedOptions(updatedOptions);
        onChange(updatedOptions.map((opt) => opt.value));
      }
    } else {
      setSelectedOptions([option]);
      setSearchQuery(option.label);
      setIsOpen(false);
      onChange(option);
    }
  };

  /**
   * Closes the dropdown if clicked outside.
   */
  const handleOutsideClick = (e) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(e.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target)
    ) {
      setIsOpen(false);
    }
  };

  /**
   * Calculates the dropdown position to ensure it fits in the viewport.
   */
  const calculateDropdownPosition = useCallback(() => {
    if (selectRef.current && dropdownRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      // Detect modal container
      const modalContainer =
        selectRef.current.closest(".sidebar-modal, .center-modal");

      if (modalContainer) {
        // Case: Inside modal (typically portals with relative positioning)
        const modalRect = modalContainer.getBoundingClientRect();
        const modalWidth = modalRect.width;
        const modalHeight = modalRect.height;

        let top = selectRect.bottom - modalRect.top;
        let left = selectRect.left - modalRect.left;

        // Horizontal overflow handling
        if (left + dropdownRect.width > modalWidth) {
          left = selectRect.right - dropdownRect.width - modalRect.left;
        }
        if (left < 0) {
          left = selectRect.left - modalRect.left;
        }

        // Vertical overflow handling
        if (top + dropdownRect.height > modalHeight) {
          top = selectRect.top - dropdownRect.height - modalRect.top;
        }
        if (top < 0) {
          top = selectRect.bottom - modalRect.top;
        }

        setDropdownPosition({ top, left });
      } else {
        // Case: Standard page layout
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = selectRect.bottom;
        let left = selectRect.left;

        if (left + dropdownRect.width > viewportWidth) {
          left = selectRect.right - dropdownRect.width;
        }
        if (left < 0) {
          left = selectRect.left;
        }

        if (top + dropdownRect.height > viewportHeight) {
          top = selectRect.top - dropdownRect.height;
        }
        if (top < 0) {
          top = selectRect.bottom;
        }

        setDropdownPosition({ top, left });
      }
    }
  }, []);


  // Effect to handle outside click, scroll, and resize events
  useEffect(() => {
    if (isOpen) {
      calculateDropdownPosition();
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", calculateDropdownPosition, true); // Add scroll listener
      window.addEventListener("resize", calculateDropdownPosition); // Add resize listener
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", calculateDropdownPosition, true); // Remove scroll listener
      window.removeEventListener("resize", calculateDropdownPosition); // Remove resize listener
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", calculateDropdownPosition, true);
      window.removeEventListener("resize", calculateDropdownPosition);
    };
  }, [isOpen, calculateDropdownPosition]);

  useEffect(() => {
    if (isOpen) {
      calculateDropdownPosition();
    }
  }, [isOpen, calculateDropdownPosition]);

  useEffect(() => {
    if (!multiple && defaultOption && isSearchable) {
      setSearchQuery(defaultOption.label); // Set the search query to the default option's label
    }
  }, [defaultOption, isSearchable, multiple]);

  // Effect to handle value prop changes
  useEffect(() => {
    if (value !== undefined) {
      const valueArray = multiple
        ? value.map((val) =>
          options.find((option) => option.value === val)
        ).filter(Boolean)
        : [options.find((option) => option.value === value)].filter(Boolean);

      setSelectedOptions(valueArray);
      if (!multiple && isSearchable && valueArray[0]) {
        setSearchQuery(valueArray[0].label);
      }
    }
  }, [value, options, multiple, isSearchable]);

  // Effect to warn if both value and defaultOption are provided
  useEffect(() => {
    if (value !== undefined && defaultOption !== null) {
      console.warn(
        "⚠️ Warning: You passed both `value` and `defaultOption` to <Select>. Only `value` will be used."
      );
    }
  }, [value, defaultOption]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsOpen(false); // Close dropdown if it goes out of view
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% is out of view
    );

    if (isOpen && dropdownRef.current) {
      observer.observe(dropdownRef.current);
    }

    return () => {
      observer.disconnect(); // Clean up observer on unmount or dropdown close
    };
  }, [isOpen]);

  useEffect(() => {
    const handleZoomOrResize = () => {
      calculateDropdownPosition();
    };

    // Use ResizeObserver for reliable size monitoring
    const resizeObserver = new ResizeObserver(() => {
      handleZoomOrResize();
    });

    if (selectRef.current) {
      resizeObserver.observe(selectRef.current);
    }

    // Fallback for device pixel ratio changes on zoom
    const handleZoom = () => {
      handleZoomOrResize();
    };

    window.addEventListener("resize", handleZoom);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleZoom);
    };
  }, [calculateDropdownPosition]);

  const visibleTags = limitTags
    ? selectedOptions.slice(0, limitTags)
    : selectedOptions;
  const collapsedTagCount = selectedOptions.length - visibleTags.length;

  return (
    <div
      className="custom-select-wrapper"
      tabIndex={0}
      onBlur={(e) => {
        setTimeout(() => {
          const active = document.activeElement;
          const selectEl = selectRef.current;
          const dropdownEl = dropdownRef.current;

          if (
            (!selectEl || !selectEl.contains(active)) &&
            (!dropdownEl || !dropdownEl.contains(active))
          ) {
            onBlur?.(e);
            setIsOpen(false);
          }
        }, 100);
      }}

    >
      <div
        className={`custom-select ${disabled ? "disabled" : ""} ${isOpen ? "active" : "inactive"
          }`}
        ref={selectRef}
      >
        <button
          className="custom-select__control"
          onMouseDown={(e) => {
            e.preventDefault(); // prevent focus loss
            handleToggle();
          }}
          role="button"
          type="button"
          tabIndex={0}
        >
          <div className="custom-select__search-and-chips">
            {multiple && selectedOptions.length > 0 && (
              <div className="custom-select__chips">
                {/* Show all selected tags if dropdown is open, limit them if closed */}
                {isOpen
                  ? selectedOptions.map((option) => (
                    <span key={option.value} className="custom-select__chip">
                      <div className="custom-select__chip-label">
                        {option.label}
                      </div>
                      <div className="custom-select__chip-close">
                        <Iconify
                          icon="si:close-circle-fill"
                          width={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionClick(option);
                          }}
                        />
                      </div>
                    </span>
                  ))
                  : // If dropdown is closed, show limited tags based on limitTags prop
                  visibleTags.map((option) => (
                    <span key={option.value} className="custom-select__chip">
                      <div className="custom-select__chip-label">
                        {option.label}
                      </div>
                      <div className="custom-select__chip-close">
                        <Iconify
                          icon="si:close-circle-fill"
                          width={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionClick(option);
                          }}
                        />
                      </div>
                    </span>
                  ))}

                {/* Show collapsed tag count if needed */}
                {!isOpen && collapsedTagCount > 0 && (
                  <span className="custom-select__limittag">
                    +{collapsedTagCount}
                  </span>
                )}
              </div>
            )}

            {isSearchable && (
              <input
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={placeholder} // Use only input's placeholder when searchable
                className="custom-select__search-input"
              />
            )}
            {multiple && selectedOptions.length === 0 && !isSearchable && (
              <span className="custom-select__placeholder">{placeholder}</span>
            )}
            {!multiple && !isSearchable && selectedOptions.length === 0 && (
              <span className="custom-select__placeholder">{placeholder}</span>
            )}
            {!multiple && !isSearchable && selectedOptions.length > 0 && (
              <div className="custom-select__content">
                <span className="custom-select__selected-option">
                  {selectedOptions[0].label}
                </span>
              </div>
            )}
          </div>
          <div className="custom-select__actionbtns">
            {selectedOptions.length > 0 && (
              //<button className="custom-select__clear-icon">
              <Iconify
                icon="ic:round-clear"
                width={18}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent focus change
                  e.stopPropagation(); // Prevent bubbling to dropdown toggle
                  handleClear();
                }}
              />
              //</button>
            )}
            <div className="custom-select__dropdownarrow">
              <Iconify icon="ep:arrow-down-bold" width={14} />
            </div>
          </div>
        </button>
        {isOpen && (
          <div
            className="custom-select__dropdown"
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: selectRef.current.getBoundingClientRect().width,
            }}
          >
            {availableOptions.length > 0 ? (
              availableOptions.map((option) => (
                <div
                  key={option.value}
                  className={`custom-select__option ${!multiple &&
                    selectedOptions.some(
                      (selected) => selected.value === option.value
                    )
                    ? "selectedoption"
                    : ""
                    }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="custom-select__no-options">No options</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Define PropTypes for better documentation and type checking
Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired, // Array of options for the dropdown
  disabled: PropTypes.bool, // Determines if the dropdown is disabled
  placeholder: PropTypes.string, // Placeholder text for the dropdown
  onChange: PropTypes.func.isRequired, // Callback function to handle value changes
  isSearchable: PropTypes.bool, // Enables the search functionality
  multiple: PropTypes.bool, // Enables multiple selection
  limitTags: PropTypes.number, // Maximum number of tags to display before showing "+X more"
  defaultOption: PropTypes.oneOfType([
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    }),
    PropTypes.array,
  ]), // Default selected option(s)
  onBlur: PropTypes.func, // Callback function to handle blur event
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    PropTypes.string,
    PropTypes.number,
  ]),

};

export default Select;