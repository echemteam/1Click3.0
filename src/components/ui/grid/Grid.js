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

const Grid = ({ columns, data, showPagination = true, onBtnClick, isAction }) => {
  const gridTemplateColumns = columns
    .map((col) => col.width || "1fr")
    .join(" ");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;
  const paginatedData = showPagination
    ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : data;

  const totalPages = Math.ceil(data.length / rowsPerPage);

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

        {/* {isAction && (
          <button onClick={() => onBtnClick(row)}>View</button>
        )} */}
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
            {Math.min(currentPage * rowsPerPage, data.length)} of {data.length}{" "}
            Results
          </span>
          <div className="page-controls">
            <button
              className="arrow-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <Iconify icon="prime:chevron-left" width={20} height={20} />
            </button>
            {[...Array(totalPages).keys()].map((n) => (
              <button
                key={n}
                className={currentPage === n + 1 ? "active" : ""}
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </button>
            ))}
            <button
              className="arrow-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
