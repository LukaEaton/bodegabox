import { Accordion, TabHeader, Toggle, RgbModal, Modal, Search, DropdownSelect } from "../components";
import { useTheme } from "../context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { RgbColorPicker, RgbColor } from "react-colorful";
import { FaCheck } from "react-icons/fa";
import { Ingredient, Category, Store, Option } from "../types";
import { IngredientService, CategoryService, StoreService } from "../services";

export function SettingsPage() {

    const { theme, toggleTheme, secondaryColor, setSecondaryColor } = useTheme();

    const [ secondaryModalOpen, setSecondaryModalOpen ] = useState(false);
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
        setSecondaryModalOpen(false);
    };

    const [manageModalOpen, setManageModalOpen] = useState(false);
    const [mode, setMode] = useState<"Add" | "Edit">("Add");
    const [manageEntity, setManageEntity] = useState<"Ingredient" | "Category" | "Store">("Ingredient");
    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Ingredient | Category | Store | null>(null);
    const [name, setName] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const onCloseManageModal = () => {
        setManageModalOpen(false);
        setSearch("");
        setSelected(null);
        setName("");
        setSelectedCategory(null);
        setSelectedStore(null);
    };
    const handleSearch = async (input: string): Promise<Option[]> => {
        if(manageEntity === "Ingredient") {
            const ingredients = await IngredientService.searchIngredients(input);
            return ingredients.map(ing => ({ value: ing.id, label: ing.name, obj: ing }));
        }
        // else if(manageEntity === "Category") {
        //     const categories = await CategoryService.searchCategories(input);
        //     return categories.map(cat => ({ value: cat.id, label: cat.name }));
        // }
        // else if(manageEntity === "Store") {
        //     const stores = await StoreService.searchStores(input);
        //     return stores.map(store => ({ value: store.id, label: store.name }));
        // }
        else return [];
    }
    useEffect(() => {
        if(manageEntity === "Ingredient") {
            CategoryService.getCategories().then(setCategories);
            StoreService.getStores().then(setStores);
        }
    }, [manageEntity]);
    useEffect(() => {
        if(selected){
            if(manageEntity === "Ingredient"){
                setName((selected as Ingredient).name || "");
                setSelectedCategory((selected as Ingredient).categoryId || null);
                setSelectedStore((selected as Ingredient).storeId || null);
            }
            else if(manageEntity === "Category"){
                setName((selected as Category).name || "");
            }
            else if(manageEntity === "Store"){
                setName((selected as Store).name || "");
            }
            else {
                console.error("Unknown management entity:", manageEntity);
            }
        }
    }, [selected]);

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
                <hr />
                <Accordion title="Manage Ingredients" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list" style={{paddingBottom:"0"}}>
                        <li className="accordion-option settings-option" onClick={() => {setMode("Add");setManageEntity("Ingredient");setManageModalOpen(true);}}><span>Add Ingredient</span><IoIosArrowForward /></li>
                        <li className="accordion-option settings-option" onClick={() => {setMode("Edit");setManageEntity("Ingredient");setManageModalOpen(true);}}><span>Edit/Delete Ingredient</span><IoIosArrowForward /></li>
                    </ul>
                </Accordion>
                <hr />
                <Accordion title="Manage Categories" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list" style={{paddingBottom:"0"}}>
                        <li className="accordion-option settings-option"><span>Add Category</span><IoIosArrowForward /></li>
                        <li className="accordion-option settings-option"><span>Edit/Delete Category</span><IoIosArrowForward /></li>
                    </ul>
                </Accordion>
                <hr />
                <Accordion title="Manage Stores" flipped={true} style={{ marginBottom: "20px" }} startClosed={true}>
                    <ul className="accordion-list" style={{paddingBottom:"0"}}>
                        <li className="accordion-option settings-option"><span>Add Store</span><IoIosArrowForward /></li>
                        <li className="accordion-option settings-option"><span>Edit/Delete Store</span><IoIosArrowForward /></li>
                    </ul>
                </Accordion>
            </div>
            <RgbModal isOpen={secondaryModalOpen} onClose={() => setSecondaryModalOpen(false)} />
            <Modal
                isOpen={secondaryModalOpen}
                onClose={() => setSecondaryModalOpen(false)}
                title="Secondary Color"
                footerButtons={[{
                    icon: <FaCheck />,
                    onClick: handleSetSecondaryColor,
                    className: "add-button enabled-button"
                }]}
                containerClass="modal-width-fit-content"
            >
                <RgbColorPicker style={{ width: "200px", height: "200px", margin: "20px auto" }} color={secondaryColorRgb} onChange={setSecondarColorRgb} />
            </Modal>
            <Modal
                isOpen={manageModalOpen}
                onClose={onCloseManageModal}
                title={`${mode === "Add" ? mode : "Edit/Delete"} ${manageEntity}`}
            >
                {mode === "Edit" && 
                    <Search 
                        searchRef={inputRef}
                        search={search}
                        setSearch={setSearch}
                        setSelected={setSelected}
                        searchMethod={handleSearch}
                    />
                }
                <h4 style={{ margin: "20px 0 8px" }}>{manageEntity} Name</h4>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={`Enter new ${manageEntity} name`} className="input-field" />
                {manageEntity === "Ingredient" && 
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", margin: "20px 0" }}>
                        <div>
                            <h4 style={{ margin: "0 0 8px" }}>Category</h4>
                            <DropdownSelect 
                                options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                            />
                        </div>
                        <div>
                            <h4 style={{ margin: "0 0 8px" }}>Store</h4>
                            <DropdownSelect 
                                options={stores.map(store => ({ value: store.id, label: store.name }))}
                                value={selectedStore}
                                onChange={setSelectedStore}
                            />
                        </div>
                    </div>
                }
            </Modal>
        </>
    );
}