import React from "react";
import PropTypes from 'prop-types';
import "./Label.scss";

const Label = (props) => {
  return (
    <div>
      {props.label && props.labelName !== "" ? (
        <label className="input-label" htmlFor={props.htmlFor}>{props.label}
          {props.label.length > 0 && props.isRequired && <span className="is-required">*</span>}
        </label>
      ) : null}
    </div>
  );
};

Label.propTypes = {
  label: PropTypes.string,
  htmlFor: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default Label;
