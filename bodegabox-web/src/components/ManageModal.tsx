import { useState, useRef, useEffect } from "react";
import { ActionButtonConfig } from "./ActionButton";
import { Modal, Search, DropdownSelect } from "../components";
import { Ingredient, Category, Store, Option } from "../types";
import { IngredientService, CategoryService, StoreService } from "../services";
import { useAlert } from "../context/AlertContext";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";

type ManageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    mode: "Add" | "Edit";
    manageEntity: "Ingredient" | "Category" | "Store";
}

export function ManageModal({isOpen, onClose, mode, manageEntity}: ManageModalProps) {

    const { setAlert } = useAlert();
    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Ingredient | Category | Store | null>(null);
    const [name, setName] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedStore, setSelectedStore] = useState<number | null>(null);

    const onCloseManageModal = () => {
        onClose();
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
        else if(manageEntity === "Category") {
            const categories = await CategoryService.searchCategories(input);
            return categories.map(cat => ({ value: cat.id, label: cat.name, obj: cat }));
        }
        else if(manageEntity === "Store") {
            const stores = await StoreService.searchStores(input);
            return stores.map(store => ({ value: store.id, label: store.name, obj: store }));
        }
        else return [];
    };

    const handleAdd = async() => {
        if(name === "") {
            console.error("Name is required");
            return;
        }
        switch(manageEntity) {
            case "Ingredient":
                await IngredientService.createIngredient({ name, categoryId: selectedCategory, storeId: selectedStore })
                        .then(() => {setAlert("Ingredient Created", "Success"); onCloseManageModal();})
                        .catch((e) => setAlert(e.message, "Error"));
                break;
            case "Category":
                await CategoryService.createCategory({ name })
                        .then(() => {setAlert("Category Created", "Success"); onCloseManageModal();})
                        .catch((e) => setAlert(e.message, "Error"));
                break;
            case "Store":
                await StoreService.createStore({ name })
                        .then(() => {setAlert("Store Created", "Success"); onCloseManageModal();})
                        .catch((e) => setAlert(e.message, "Error"));
                break;
            default:
                console.error("Unknown management entity:", manageEntity);
        }
    };
    const handleEdit = async() => {
        if(!selected){
            console.error("No item selected for editing");
            return;
        }
        switch(manageEntity) {
            case "Ingredient":
                await IngredientService.updateIngredient({id: (selected as Ingredient).id, name, categoryId: selectedCategory, storeId: selectedStore})
                        .then(() => {setAlert("Ingredient Updated", "Success"); onCloseManageModal();})
                        .catch((e) => setAlert(e.message, "Error"));
                break;
            case "Category":
                await CategoryService.updateCategory({id: (selected as Category).id!, name })
                        .then(() => {setAlert("Category Updated", "Success"); onCloseManageModal();})
                        .catch((e) => setAlert(e.message, "Error"));
                break;
            case "Store":
                await StoreService.updateStore({id: (selected as Store).id, name })
                        .then(() => {setAlert("Store Updated", "Success"); onCloseManageModal();})
                        .catch((e) => setAlert(e.message, "Error"));
                break;
            default:
                console.error("Unknown management entity:", manageEntity);
        }
    };
    const handleDelete = async() => {
        if(!selected){
            console.error("No item selected for deletion");
            return;
        }
        switch(manageEntity) {
            case "Ingredient":
                await IngredientService.deleteIngredient((selected as Ingredient).id)
                        .then(() => {setAlert("Ingredient Deleted", "Success"); onCloseManageModal();})
                        .catch((e) => setAlert(e.message, "Error"));
                break;
            case "Category":
                await CategoryService.deleteCategory((selected as Category).id!)
                        .then(() => {setAlert("Category Deleted", "Success"); onCloseManageModal();})
                        .catch((e) => setAlert(e.message, "Error"));
                break;
            case "Store":
                await StoreService.deleteStore((selected as Store).id)
                        .then(() => {setAlert("Store Deleted", "Success"); onCloseManageModal();})
                        .catch((e) => setAlert(e.message, "Error"));
                break;
            default:
                console.error("Unknown management entity:", manageEntity);
        }
    };

    const addButtonConfig: ActionButtonConfig[] = [
        {
            label: "Add",
            icon: <FaCirclePlus style={{ marginRight: "5px" }} />,
            onClick: handleAdd,
            className: "add-button",
            disabled: name === ""
        }
    ];
    const editAndDeleteButtonConfig: ActionButtonConfig[] = [
        {
            label: "Save",
            icon: <FaCheck style={{ marginRight: "5px" }} />,
            onClick: handleEdit,
            className: "add-button",
            disabled: selected === null
        },
        {
            label: "Delete",
            icon: <FaTimes style={{ marginRight: "5px" }} />,
            onClick: handleDelete,
            className: "delete-button",
            disabled: selected === null
        }
    ];

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
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onCloseManageModal}
            title={`${mode === "Add" ? mode : "Edit/Delete"} ${manageEntity}`}
            footerButtons={mode === "Add" ? addButtonConfig : editAndDeleteButtonConfig}
        >
            {mode === "Edit" && 
                <>
                    <h4 style={{ margin: "20px 0 8px" }}>Select {manageEntity}</h4>
                    <Search 
                        searchRef={inputRef}
                        search={search}
                        setSearch={setSearch}
                        setSelected={setSelected}
                        searchMethod={handleSearch}
                    />
                </>
            }
            <h4 style={{ margin: "20px 0 8px" }}>{mode==="Edit" && "Edit "}{manageEntity} Name</h4>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={`New ${manageEntity} name`} className="input-field" disabled={mode==="Edit" && selected===null} />
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
    );
}