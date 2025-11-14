import { useState, useRef, useEffect } from "react";
import { Option } from "../types";
import { IoIosArrowDown } from "react-icons/io";
import { FaTimes } from "react-icons/fa";

type DropdownSelectProps = {
  options: Option[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  className?: string;
};

export function DropdownSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`dropdown ${className || ""}`} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="dropdown-button"
      >
        {options.find((opt) => opt.value === value)?.label || placeholder}
        <div className="dropdown-icons">
          <FaTimes
            className="dropdown-close"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onChange(null);
            }}
          />
          <IoIosArrowDown className={`dropdown-arrow ${open ? "rotate" : ""}`} />
        </div>
      </button>

      <div className={`dropdown-menu ${open ? "open" : ""}`}>
        {options.map((opt) => (
          <div
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            className="dropdown-item"
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}