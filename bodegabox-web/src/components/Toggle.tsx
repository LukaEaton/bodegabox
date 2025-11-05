export function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }}
      />
      <span
        style={{
          width: "40px",
          height: "20px",
          borderRadius: "20px",
          background: checked ? "#28a745" : "#ccc",
          position: "relative",
          transition: "background 0.3s",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: checked ? "22px" : "2px",
            top: "2px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.3s",
          }}
        />
      </span>
    </label>
  );
}