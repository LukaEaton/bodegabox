import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { RgbColorPicker, RgbColor } from "react-colorful";
import { FaCheck, FaTimes } from "react-icons/fa";

type RgbModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export function RgbModal({ isOpen, onClose }: RgbModalProps) {
    
    if (!isOpen) return null;
    
    const { secondaryColor, setSecondaryColor } = useTheme();
    const [secondaryColorRgb, setSecondarColorRgb] =  useState<RgbColor>(rgbaToRgbColor(secondaryColor));

    function rgbaToRgbColor(rgba: string): RgbColor {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]*)\)?/);
        if (!match) return { r: 0, g: 0, b: 0 };
        const [, r, g, b ] = match;
        return {
            r: Number(r),
            g: Number(g),
            b: Number(b),
        };
    }

    const getRgbaString = (color: RgbColor) => {
        return `rgba(${color.r},${color.g},${color.b}, 1)`;
    }
    
    const handleSetSecondaryColor = () => {
        setSecondaryColor(getRgbaString(secondaryColorRgb));
        onClose();
    };
    
    useEffect(() => {
        setSecondarColorRgb(rgbaToRgbColor(secondaryColor));
    }, [secondaryColor]);

    return (
        <div className="modal-overlay">
            <div className="modal-container" style={{width:"fit-content", padding:"15px"}}>
                <div className="modal-header">
                    <h3 style={{ margin: "0px" }}>Secondary Color</h3>
                    <FaTimes className="close-button" onClick={onClose} />
                </div>
                <hr/>
                <div className="modal-body">
                    <RgbColorPicker style={{ width: "200px", height: "200px", margin: "20px auto" }} color={secondaryColorRgb} onChange={setSecondarColorRgb} />
                </div>
                <hr/>
                <div className="modal-footer">
                    <button className="add-button enabled-button" style={{display:"flex",gap:"5px",alignItems:"center"}} onClick={handleSetSecondaryColor}>
                        <FaCheck />
                    </button>
                </div>
            </div>
        </div>
    );
}