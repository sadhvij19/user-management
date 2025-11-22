import React, { useEffect } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 20px",
      background: type === "success" ? "#28a745" : "red",
      color: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      zIndex: 2000,
      fontSize: "15px"
    }}>
      {message}
    </div>
  );
}

export default Toast;
