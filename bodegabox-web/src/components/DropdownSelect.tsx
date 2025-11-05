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

export function DropdownSelect({ options, value, onChange, placeholder = "Select...", className }: DropdownSelectProps) {

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
    <div ref={ref} className={className} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="dropdown-button"
        style={{
          width: "100%",
          padding: "5px 7px",
          cursor: "pointer",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {options.find(opt => opt.value == value)?.label || placeholder}
        <div style={{ display: "flex", gap: "5px" }}>
          <FaTimes className="dropdown-close" onClick={(e) => {e.stopPropagation(); setOpen(false); onChange(null);}}/>
          <IoIosArrowDown style={open ? { transform: "rotate(180deg)" } : {}} />
        </div>
      </button>
      {open && (
        <div
          className="dropdown-button"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            marginTop: "5px",
            borderRadius: "4px",
            maxHeight: "200px",
            overflowY: "auto"
          }}
        >
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                padding: "5px 7px",
                cursor: "pointer"
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}