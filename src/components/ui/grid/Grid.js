import React, { useState } from "react";
import "./Grid.scss";
import Iconify from "../iconify/Iconify";
import PropTypes from "prop-types";

/**
 * Grid component - A responsive grid layout component for displaying tabular data.
 *
 * @param {Array} columns - An array of column objects defining the grid structure.
 * @param {Array} data - An array of data objects to be displayed in the grid.
 */

/**
 * How to use Grid component
 *
 * const columns = [
 *      { label: 'RFQ NUMBER', key: 'rfqNumber', align: 'left', width: '2fr' },
 *      { label: 'DATE', key: 'date', align: 'left', width: '2fr' },
 *      { label: 'STATUS', key: 'status', align: 'left', width: '2fr' },
 *      { label: 'CATALOG', key: 'catalog', align: 'left', width: '5fr' },
 *      { label: 'ACTION', key: 'action', align: 'center', width: '1fr' }
 * ];
 * const mockData = [
 *      {
 *          rfqNumber: "CL2025253998",
 *          date: "02-12-2025 10:56",
 *          status: "Open",
 *          catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
 *          action: <a href="#">View</a>
 *      },
 * ]
 *
 * return (
 *      <div style={{ padding: "20px" }}>
 *          <Grid columns={columns} data={mockData} />
 *      </div>
 * )
 */

const Grid = ({
  columns,
  data,
  showPagination = true,
  pageSize,
  count,
  onBtnClick,
  isAction,
  onPageChange, // NEW PROP
}) => {
  const gridTemplateColumns = columns
    .map((col) => col.width || "1fr")
    .join(" ");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = pageSize;
  const paginatedData = data;
    // showPagination
    // ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    // : data;

  const totalPages = Math.ceil(count / rowsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page); // 🔹 Call parent when page changes
    }
  };

  return (
    <div className="grid-container">
      <div className="grid-header" style={{ gridTemplateColumns }}>
        {columns.map((col, index) => (
          <div key={index} style={{ textAlign: col.align || "left" }}>
            {col.label}
          </div>
        ))}
      </div>

      <div className="grid-body">
        {paginatedData.length > 0 ? (
          paginatedData.map((row, rowIndex) => (
            <div
              className="grid-row"
              key={rowIndex}
              style={{ gridTemplateColumns }}
            >
              {columns.map((col, colIndex) => (
                <div
                  className={`grid-cell ${col.align || "left"} `}
                  key={colIndex}
                >
                  <span className="cell-label">{col.label}</span>
                  <span className="cell-value">
                    {col.render ? col.render(row) : row[col.key]}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="no-records-found">No records found</div>
        )}
      </div>

      {showPagination && (
        <div className="pagination">
          <span className="pagination-text">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, count)} of {count} Results
          </span>
          <div className="page-controls">
            <button
              className="arrow-btn"
              onClick={() => changePage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <Iconify icon="prime:chevron-left" width={20} height={20} />
            </button>
            {[...Array(totalPages).keys()].map((n) => (
              <button
                key={n}
                className={currentPage === n + 1 ? "active" : ""}
                onClick={() => changePage(n + 1)}
              >
                {n + 1}
              </button>
            ))}
            <button
              className="arrow-btn"
              onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <Iconify icon="prime:chevron-right" width={20} height={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


Grid.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default Grid;
