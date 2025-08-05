import React, { useState, useEffect } from "react";
import "./Counter.scss";
import Iconify from "../iconify/Iconify";

const Counter = ({ counts, onChange, disabled = false }) => {
  const [count, setCount] = useState(counts || 1);

  useEffect(() => {
    setCount(counts || 1);
  }, [counts]);

  const increment = () => {
    if (disabled) return;
    const newCount = count + 1;
    setCount(newCount);
    if (onChange) onChange(newCount);
  };

  const decrement = () => {
    if (disabled) return;
    const newCount = Math.max(count - 1, 1);
    setCount(newCount);
    if (onChange) onChange(newCount);
  };

  return (
    <div className={`counter ${disabled ? "counter-disabled" : ""}`}>
      <button className="btn" onClick={decrement} disabled={disabled}>
        <Iconify icon="tabler:minus" width={22} />
      </button>
      <div className="count">{count}</div>
      <button className="btn" onClick={increment} disabled={disabled}>
        <Iconify icon="tabler:plus" width={22} />
      </button>
    </div>
  );
};

export default Counter;
