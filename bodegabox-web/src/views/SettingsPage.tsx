import { Accordion, TabHeader } from "../components";
import { RgbaColorPicker, RgbaColor } from "react-colorful";
import { useState } from "react";

export function SettingsPage() {

    const [secondaryColor, setSecondaryColor] = useState<RgbaColor>({ r: 255, g: 0, b: 0, a: 1 });

    return (
        <>
            <TabHeader title="Settings" />
            <div className="settings-body" style={{ padding: "20px" }}>
                <Accordion title="Color Theme" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list">
                        <li className="accordion-option">Dark/Light Mode</li>
                        <li className="accordion-option">Secondary Color: {`rgba(${secondaryColor.r},${secondaryColor.g},${secondaryColor.b},${secondaryColor.a})`}</li>
                        <RgbaColorPicker style={{ width: "200px", height: "200px" }} color={secondaryColor} onChange={setSecondaryColor} />
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