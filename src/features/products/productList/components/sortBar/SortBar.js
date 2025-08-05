import React from "react";
import PropTypes from "prop-types";
import "./SortBar.scss";
import Select from "@components/ui/select/Select";
import Input from "@components/ui/input/Input";
import IconButton from "@components/ui/iconButton/IconButton";

const SortBar = ({ onViewChange, onSortChange, totalCount }) => {
  // Added sorting options for ProductName and ProductId to match stored procedure
  const sortOptions = [
    { value: "Ascending", label: "Ascending" },
    { value: "Descending", label: "Descending" },
  ];

  return (
    <div className="sort-bar">
      <div className="sort-bar_sort-by">
        <label>Sort by:</label>
        {/* Updated Select to use sortOptions and trigger onSortChange */}
        <Select
          options={sortOptions}
          placeholder="Select"
          onChange={onSortChange}
        />
      </div>
      <div className="sort-bar_view-toggle">
        <div className="sort-bar_view-toggle_show-input">
          <label>Show:</label>
          {/* Retained original Input, no changes for sorting */}
          <Input value={totalCount} />
        </div>
        <div className="sort-bar_view-toggle_toggle">
          {/* Retained original total product text, no changes for sorting */}
          <div className="sort-bar_view-toggle_toggle_total-product">
            out of <span>250 products</span>
          </div>
          <div className="sort-bar_view-toggle_toggle_buttons">
            {/* Retained view toggle buttons, no changes for sorting */}
            <IconButton
              variant="outlined"
              icon="gridicons:grid"
              shape="square"
              color="secondary"
              size="small"
              onClick={() => onViewChange("grid")}
            />
            <IconButton
              variant="outlined"
              icon="ion:list-sharp"
              color="secondary"
              shape="square"
              size="small"
              onClick={() => onViewChange("list")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Added PropTypes for onViewChange and onSortChange
SortBar.propTypes = {
  onViewChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default SortBar;