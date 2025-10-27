import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

type AlertProps = {
  message: string;
  type: "Success" | "Error" | "Warning";
  onClose: () => void;
}

export function Alert({ message, type, onClose }: AlertProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return p - 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onClose]);

  const backgroundColors = {
    Success: "#2ecc71",
    Error: "#e74c3c",
    Warning: "#f1c40f",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: backgroundColors[type],
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "8px",
        minWidth: "220px",
        maxWidth: "300px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontSize: "14px",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <span style={{ fontWeight: 500 }}>{message}</span>
        <FaTimes
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            lineHeight: "16px",
            cursor: "pointer",
          }}
        />
      </div>

      <div
        style={{
          height: "4px",
          width: `${progress}%`,
          backgroundColor: "rgba(255,255,255,0.7)",
          borderRadius: "4px",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
};