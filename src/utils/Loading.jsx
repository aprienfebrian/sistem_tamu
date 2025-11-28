"use client";
import React from "react";
import "../App.css";

export default function LoadingDots({
  size = 10,
  color = "#fff",
  full = false,
}) {
  return (
    <div className={full ? "loader-wrap" : ""}>
      <div
        className="dots"
        style={{ "--dot-size": `${size}px`, "--dot-color": color }}
      >
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}
