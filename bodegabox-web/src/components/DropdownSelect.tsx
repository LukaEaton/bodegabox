import { useState, useRef, useEffect } from "react";

type Option = {
  value: number;
  label: string;
};

type DropdownSelectProps = {
  options: Option[];
  value: number | null;
  onChange: (value: number) => void;
  placeholder?: string;
};

export function DropdownSelect({ options, value, onChange, placeholder = "Select..." }: DropdownSelectProps) {
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
    <div ref={ref} style={{ position: "relative", display: "inline-block", minWidth: 160 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          textAlign: "left"
        }}
      >
        {options.find(opt => opt.value == value)?.label || placeholder}
        <span style={{ float: "right" }}>▼</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            zIndex: 10
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
                padding: "8px",
                cursor: "pointer",
                background: value === opt.value ? "#eee" : "#fff"
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