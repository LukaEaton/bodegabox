import { useState, useRef, useEffect } from "react";
import { Option } from "../types";
import { IoIosArrowDown } from "react-icons/io";
import { FaTimes } from "react-icons/fa";

type DropdownSelectProps = {
  options: Option[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  backgroundColor: string;
  selectedBackgroundColor: string;
  fontColor: string;
  borderColor: string;
  className?: string;
};

export function DropdownSelect({ options, value, onChange, placeholder = "Select...", 
    backgroundColor, selectedBackgroundColor, borderColor, className }: DropdownSelectProps) {

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
        style={{
          width: "100%",
          padding: "5px 7px",
          border: `1px solid ${borderColor}`,
          background: backgroundColor,
          color: "white",
          cursor: "pointer",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {options.find(opt => opt.value == value)?.label || placeholder}
        <div style={{ display: "flex", gap: "5px" }}>
          <FaTimes className="dropdown-close" onClick={() => {setOpen(false); onChange(null);}}/>
          <IoIosArrowDown style={open ? { transform: "rotate(180deg)" } : {}} />
        </div>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: backgroundColor,
            border: `1px solid ${borderColor}`,
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
                cursor: "pointer",
                background: value === opt.value ? selectedBackgroundColor : backgroundColor
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