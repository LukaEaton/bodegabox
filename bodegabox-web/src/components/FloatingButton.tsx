import React from "react";

type FloatingButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
}

export function FloatingButton({ onClick, children }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="floating-button"
    >
      {children}
    </button>
  );
};

export default FloatingButton;
