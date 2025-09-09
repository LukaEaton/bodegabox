import { useState, useEffect } from "react";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  forceExpand?: boolean | null;
};

export function Accordion({ title, children, forceExpand }: AccordionProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (forceExpand != null) {
      setOpen(forceExpand);
    }
  }, [forceExpand]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ alignItems: "center", gap: "8px" }}>
        <button
            style={{
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                gap: "5px",
                alignItems: "center"
            }}
            onClick={() => setOpen((o) => !o)}
        >
            <svg 
                style={open ? { transform: "rotate(90deg)" } : {}}
                width={25} 
                height={25} 
                viewBox="0 0 24 24" 
                fill="none"
            >
                <path 
                    d="M10 7L15 12L10 17" stroke="#ffffff" 
                    strokeWidth="1.5" strokeLinecap="round" 
                    strokeLinejoin="round">
                </path>
            </svg>
            <h2 style={{ margin: "0px" }}>{title}</h2>
        </button>
      </div>
      {open && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
}