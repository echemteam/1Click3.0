import React from "react";
import "./HealthAndSafety.scss";
import Iconify from "@components/ui/iconify/Iconify";

const HealthAndSafety = () => {
  const infoData = [
    { label: "Symbol", value: <div> <Iconify icon="uiw:warning-o" width={20} height={20} /></div>},
    { label: "Signal Word", value: "Warning" },
    { label: "Hazard Statements", value: "H302 (100%): Harmful if swallowed [Warning Acute toxicity, oral], H332 (100%): Harmful if inhaled [Warning Acute toxicity, inhalation], H411 (100%): Toxic to aquatic life with long lasting effects [Hazardous to the aquatic environment, long-term hazard]" },
    { label: "Precautionary Statements", value: "P261, P264, P270, P271, P273, P301+P317, P304+P340, P317, P330, P391, and P501" },
    { label: "TSCA", value: "Not available" },
    { label: "Safety Statements", value: "Not available" },
    { label: "Risk Statements", value: "Not available" },
  ];
  return (
    <div className="health-and-aafety-container ">
      <div className="info-table">
        {infoData.map((item, index) => (
          <div className="info-table__row" key={index}>
            <div className="info-table__label">{item.label}</div>
            <div className="info-table__value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthAndSafety;
