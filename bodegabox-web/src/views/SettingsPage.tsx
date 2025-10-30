import { Accordion, TabHeader } from "../components";

export function SettingsPage() {
    return (
        <>
            <TabHeader title="Settings" />
            <div className="settings-body" style={{ padding: "20px" }}>
                <Accordion title="Color Theme" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list">
                        <li className="accordion-option">Dark/Light Mode</li>
                        <li className="accordion-option">Secondary Color</li>
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