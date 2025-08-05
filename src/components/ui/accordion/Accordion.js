import React, { useState } from "react";
import "./Accordion.scss";
import Iconify from "../iconify/Iconify";

const Accordion = ({ children, icon = "tabler:plus", stayOpen = false }) => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleAccordion = (index) => {
    if (stayOpen) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) =>
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div className="accordion">
      {React.Children.map(children, (child, index) => {
        const isOpen = openIndexes.includes(index);
        const { title } = child.props;

        return (
          <div className={`accordion-item ${isOpen ? "open" : ""}`} key={index}>
            <div
              className={`accordion-header ${isOpen ? "active" : ""}`}
              onClick={() => toggleAccordion(index)}
            >
              <span>{title}</span>
              <div className={`icon ${isOpen ? "rotate" : ""}`}>
                <Iconify icon={icon} width={20} />
              </div>
            </div>
            <div
              className="accordion-content"
              style={{
                maxHeight: isOpen ? "1000px" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;