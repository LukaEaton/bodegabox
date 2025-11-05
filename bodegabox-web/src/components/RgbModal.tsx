import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { RgbColorPicker, RgbColor } from "react-colorful";
import { FaCheck } from "react-icons/fa";
import { ActionButtonConfig } from "./ActionButton";
import { Modal } from "../components"

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

    const setButtonConfig: ActionButtonConfig[] = [
        {
            icon: <FaCheck />,
            onClick: handleSetSecondaryColor,
            className: "add-button enabled-button"
        }
    ];
    
    useEffect(() => {
        setSecondarColorRgb(rgbaToRgbColor(secondaryColor));
    }, [secondaryColor]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Secondary Color"
            containerClass="rgb-modal"
            footerButtons={setButtonConfig}
        >
            <RgbColorPicker style={{ width: "200px", height: "200px", margin: "20px auto" }} color={secondaryColorRgb} onChange={setSecondarColorRgb} />
        </Modal>
    );
}