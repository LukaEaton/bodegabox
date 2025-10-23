import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void; // Callback when ingredient is added
}

export function AddIngredientModal({ isOpen, onClose, onAdd }: AddIngredientModalProps) {
  const [ingredientName, setIngredientName] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (ingredientName.trim() === "") return;
    onAdd(ingredientName.trim());
    setIngredientName("");
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2>Add Ingredient</h2>
          <button onClick={onClose} style={closeButtonStyle}>
            <FaTimes />
          </button>
        </div>
        <div style={bodyStyle}>
          <input
            type="text"
            placeholder="Ingredient name"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={footerStyle}>
          <button onClick={handleAdd} style={addButtonStyle}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  width: "400px",
  maxWidth: "90%",
  padding: "20px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
};

const closeButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};

const bodyStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const footerStyle: React.CSSProperties = {
  textAlign: "right",
};

const addButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default AddIngredientModal;