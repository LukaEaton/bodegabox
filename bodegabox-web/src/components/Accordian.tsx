import { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  forceExpand?: boolean | null;
  style? : React.CSSProperties;
};

export function Accordion({ title, children, forceExpand, style }: AccordionProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (forceExpand != null) {
      setOpen(forceExpand);
    }
  }, [forceExpand]);

  return (
    <div style={style}>
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
            <IoIosArrowForward style={open ? { transform: "rotate(90deg)"} : {}}/>
            <h3 style={{ margin: "0px" }}>{title}</h3>
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