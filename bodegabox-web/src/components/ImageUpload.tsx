import { useRef, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaTimes } from "react-icons/fa";

type ImageUploadProps = {
  onFileSelect: (file: File | null) => void;
}

export function ImageUpload({ onFileSelect }: ImageUploadProps) {

  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div>
      { preview ?
        <div style={{
          position: "relative",
          display: "inline-block",
          marginTop: "10px"
        }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "200px",
              borderRadius: "8px",
              display: "block"
            }}
          />
          <FaTimes
            onClick={removeImage}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              cursor: "pointer",
              background: "rgba(0,0,0,0.6)",
              color: "white",
              borderRadius: "50%",
              padding: "5px",
            }}
            size={18}
          />
        </div>
        :
        <label className="file-input-wrapper" onClick={handleClick}>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{display: "none"}}
          />
          <div
            className="secondary-color"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <MdOutlineFileUpload size={25} className="secondary-color" />
            <span style={{ fontWeight: "bold", fontSize: "20px" }}>
              Upload Image
            </span>
          </div>
        </label>
      }
    </div>
  );
}