import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Slider.scss';

const Slider = ({ type = 'single', color = 'primary', setRange, min = 0, max = 10000, valueMin, valueMax }) => {
  const [value, setValue] = useState(type === 'range' ? [min, max] : min);

  const handleChange = (e, index) => {
    if (type === 'range') {
      const newVal = [...value];
      newVal[index] = parseInt(e.target.value, 10);
      if (index === 0 && newVal[0] > newVal[1]) newVal[0] = newVal[1];
      if (index === 1 && newVal[1] < newVal[0]) newVal[1] = newVal[0];
      setValue(newVal);
      setRange(newVal)
    } else {
      setValue(parseInt(e.target.value, 10));
      setRange(parseInt(e.target.value, 10));
    }
  };
  useEffect(() => {
    if (type === 'range') {
      setValue([valueMin, valueMax]);
    } else {
      setValue(valueMin || min);
    }
  }, [valueMin, valueMax, type, min]);

  // const getFillStyle = () => {
  //   if (type === 'single') {
  //     return {
  //       left: '0%',
  //       width: `${value}%`,
  //     };
  //   } else {
  //     const [min, max] = value;
  //     return {
  //       left: `${min}%`,
  //       width: `${max - min}%`,
  //     };
  //   }
  // };
  const getFillStyle = () => {
    if (type === 'single') {
      return {
        left: '0%',
        width: `${(value / max) * 100}%`,
      };
    } else {
      const [minVal, maxVal] = value;
      return {
        left: `${(minVal / max) * 100}%`,
        width: `${((maxVal - minVal) / max) * 100}%`,
      };
    }
  };

  return (
    <div className="slider-wrapper">
      <div className="slider-track" />
      <div className={`slider-filled thumb ${color}`} style={getFillStyle()} />

      {type === 'single' ? (
        <input
          type="range"
          // min="0"
          // max="100"
          min={min}
          max={max}
          value={value}
          className={`thumb ${color}`}
          onChange={handleChange}
        />
      ) : (
        <>
          <input
            type="range"
            // min="0"
            // max="100"
            min={min}
            max={max}
            value={value[0]}
            className={`thumb ${color}`}
            onChange={(e) => handleChange(e, 0)}
          />
          <input
            type="range"
            // min="0"
            // max="100"
            min={min}
            max={max}
            value={value[1]}
            className={`thumb ${color}`}
            onChange={(e) => handleChange(e, 1)}
          />
        </>
      )}
    </div>
  );
};

Slider.propTypes = {
  type: PropTypes.oneOf(['single', 'range']),
  color: PropTypes.oneOf(['primary', 'secondary']),
  min: PropTypes.number,
  max: PropTypes.number,
  setRange: PropTypes.func.isRequired,
  valueMin: PropTypes.number,
  valueMax: PropTypes.number,
};

export default Slider;
