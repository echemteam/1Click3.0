'use client'

import React, { useState, useEffect } from "react";
import "./FloatingButton.scss";
import Iconify from "../iconify/Iconify";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="floating-button">
      <button
        onClick={scrollToTop}
        className={`floating-button__button ${isVisible ? "visible" : "hidden"}`}
      >
        <Iconify icon="bxs:up-arrow" />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
