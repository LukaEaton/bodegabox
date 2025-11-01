import { Accordion, TabHeader, Toggle } from "../components";
import { RgbColorPicker, RgbColor } from "react-colorful";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";

export function SettingsPage() {

    const { theme, toggleTheme, secondaryColor, setSecondaryColor } = useTheme();
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

    const handleSetSecondaryColor = (color: RgbColor) => {
        const rgbString = `rgba(${color.r},${color.g},${color.b}, 1)`;
        setSecondaryColor(rgbString);
    };

    useEffect(() => {
        setSecondarColorRgb(rgbaToRgbColor(secondaryColor));
    }, [secondaryColor]);

    return (
        <>
            <TabHeader title="Settings" />
            <div className="settings-body" style={{ padding: "20px" }}>
                <Accordion title="Color Theme" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list">
                        <li className="accordion-option" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span>Dark Mode</span><Toggle checked={theme === 'dark'} onChange={toggleTheme}/></li>
                        <li className="accordion-option"><button onClick={() => handleSetSecondaryColor(secondaryColorRgb)}>Set Secondary Color</button></li>
                        <RgbColorPicker style={{ width: "200px", height: "200px" }} color={secondaryColorRgb} onChange={setSecondarColorRgb} />
                    </ul>
                </Accordion>
                <Accordion title="Manage Ingredients" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list">
                        <li className="accordion-option">Add Ingredient</li>
                        <li className="accordion-option">Edit/Delete Ingredient</li>
                    </ul>
                </Accordion>
                <Accordion title="Manage Categories" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list">
                        <li className="accordion-option">Add Category</li>
                        <li className="accordion-option">Edit/Delete Category</li>
                    </ul>
                </Accordion>
                <Accordion title="Manage Stores" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list">
                        <li className="accordion-option">Add Store</li>
                        <li className="accordion-option">Edit/Delete Store</li>
                    </ul>
                </Accordion>
            </div>
        </>
        
    );
}