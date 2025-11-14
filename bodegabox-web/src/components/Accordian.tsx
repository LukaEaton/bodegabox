import { useState, useEffect, useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  forceExpand?: boolean | null;
  style?: React.CSSProperties;
  flipped?: boolean;
  startClosed?: boolean;
};

export function Accordion({
  title,
  children,
  forceExpand,
  style,
  flipped,
  startClosed,
}: AccordionProps) {
  const [open, setOpen] = useState(startClosed ? false : true);
  const [height, setHeight] = useState<string | number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceExpand != null) {
      setOpen(forceExpand);
    }
  }, [forceExpand]);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    const updateHeight = () => {
      if (open) {
        setHeight(element.scrollHeight);
      } else {
        setHeight(0);
      }
    };
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    updateHeight();
    return () => observer.disconnect();
  }, [open, children]);

  return (
    <div className="accordion" style={style}>
      <button
        className={`accordion-button ${open ? "open" : ""} ${flipped ? "accordion-button-flipped" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        {flipped ? (
          <>
            <h3 className="accordion-title">{title}</h3>
            <IoIosArrowForward
              className={`accordion-arrow ${open ? "rotate" : ""}`}
            />
          </>
        ) : (
          <>
            <IoIosArrowForward
              className={`accordion-arrow ${open ? "rotate" : ""}`}
            />
            <h3 className="accordion-title">{title}</h3>
          </>
        )}
      </button>

      <div
        ref={contentRef}
        className={`accordion-content-wrapper ${open ? "open" : ""}`}
        style={{
          maxHeight: `${height}px`,
        }}
      >
        <div className="accordion-content">{children}</div>
      </div>
    </div>
  );
}
