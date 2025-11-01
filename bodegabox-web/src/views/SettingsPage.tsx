import { Accordion, TabHeader, Toggle, RgbModal } from "../components";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

export function SettingsPage() {

    const { theme, toggleTheme } = useTheme();
    const [ secondaryModalOpen, setSecondaryModalOpen ] = useState(false);

    return (
        <>
            <TabHeader title="Settings" />
            <div className="settings-body" style={{ padding: "20px" }}>
                <Accordion title="Color Theme" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list" style={{paddingBottom:"0"}}>
                        <li className="accordion-option settings-option"><span>Dark Mode</span><Toggle checked={theme === 'dark'} onChange={toggleTheme}/></li>
                        <li className="accordion-option settings-option"><span>Secondary Color</span><button className="secondary-color-bg" style={{width:"40px",height:"20px"}} onClick={() => setSecondaryModalOpen(true)}></button></li>
                    </ul>
                </Accordion>
                <Accordion title="Manage Ingredients" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list" style={{paddingBottom:"0"}}>
                        <li className="accordion-option settings-option"><span>Add Ingredient</span><IoIosArrowForward /></li>
                        <li className="accordion-option settings-option"><span>Edit/Delete Ingredient</span><IoIosArrowForward /></li>
                    </ul>
                </Accordion>
                <Accordion title="Manage Categories" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list" style={{paddingBottom:"0"}}>
                        <li className="accordion-option settings-option"><span>Add Category</span><IoIosArrowForward /></li>
                        <li className="accordion-option settings-option"><span>Edit/Delete Category</span><IoIosArrowForward /></li>
                    </ul>
                </Accordion>
                <Accordion title="Manage Stores" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list" style={{paddingBottom:"0"}}>
                        <li className="accordion-option settings-option"><span>Add Store</span><IoIosArrowForward /></li>
                        <li className="accordion-option settings-option"><span>Edit/Delete Store</span><IoIosArrowForward /></li>
                    </ul>
                </Accordion>
            </div>
            <RgbModal isOpen={secondaryModalOpen} onClose={() => setSecondaryModalOpen(false)} />
        </>
        
    );
}