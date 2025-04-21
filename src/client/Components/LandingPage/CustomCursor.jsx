import React, { useEffect } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector(".custom-cursor");
    const cursorDot = document.querySelector(".custom-cursor-dot");

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

    
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    };

    const animateRing = () => {
     
      ringX += (mouseX - ringX) * 1.5;
      ringY += (mouseY - ringY) * 1.5;

      cursor.style.left = `${ringX}px`;
      cursor.style.top = `${ringY}px`;

      requestAnimationFrame(animateRing);
    };

    document.addEventListener("mousemove", moveCursor);
    animateRing();

    return () => {
      document.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor"></div>
      <div className="custom-cursor-dot"></div>
    </>
  );
};

export default CustomCursor;

