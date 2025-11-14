import { useRef, useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { BsPencilSquare } from "react-icons/bs";
import { IngredientService } from "../services";
import { Ingredient, PendingIngredient, Option } from "../types";
import { Search, DropdownSelect, Modal } from "../components";
import { useAlert } from "../context/AlertContext";
import { ActionButtonConfig } from "./ActionButton";

type IngredientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  onAdd: (ingredient: PendingIngredient) => void;
  onEdit: (ingredient: PendingIngredient) => void;
  categories: Option[];
  stores: Option[];
}

export function IngredientModal({ isOpen, onClose, ingredient, onAdd, onEdit, categories, stores }: IngredientModalProps) {

  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const { setAlert } = useAlert();

  const clearFields = () => {
    setSearch("");
    setSelected(null);
    setDescription("");
    setSelectedCategory(null);
    setSelectedStore(null);
  };

  const handleCreateIngredient = () => {
    IngredientService.createIngredient({name: search, categoryId: null, storeId: null})
    .then(ingredient => {
      setSelected(ingredient.id); 
      inputRef.current?.blur();
      setAlert("Ingredient Created", "Success");
    });
  }

  const handleAdd = () => {
    onAdd({ ingredientId: selected!, description: description.trim()})
    clearFields();
  };

  const handleEdit = () => {
    if((selectedCategory !== ingredient!.categoryId) ||
       (selectedStore !== ingredient!.storeId)) {
      IngredientService.updateIngredient({id: ingredient!.id, name: ingredient!.name, categoryId: selectedCategory!, storeId: selectedStore!}) 
        .then(() => onEdit({ ingredientId: ingredient!.id, description: description.trim()}))
        .catch(() => {
          setAlert("Failed to update ingredient's Category and/or Store.");
        });
    }
    else {
      onEdit({ ingredientId: ingredient!.id, description: description.trim()})
    }
    clearFields();
  };

  const handleSearch = async (input: string): Promise<Option[]> => {
    try {
      const ingredients = await IngredientService.searchIngredients(input);
      return ingredients.map(ingredient => ({
        value: ingredient.id,
        label: ingredient.name,
      }));
    } catch (error) {
      console.error("Failed to Search for Ingredients:", error);
      return [];
    }
  };

  const addButtonConfig: ActionButtonConfig[] = [
    {
      label: "Add",
      icon: <FaCirclePlus style={{ marginRight: "5px" }} />,
      onClick: handleAdd,
      className: `add-button ${!selected ? "disabled-button" : "enabled-button"}`,
      disabled: !selected
    }
  ];

  const editButtonConfig: ActionButtonConfig[] = [
    {
      label: "Edit",
      icon: <BsPencilSquare style={{ marginRight: "5px" }} />,
      onClick: handleEdit,
      className: "add-button enabled-button"
    }
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if(ingredient) {
      setDescription(ingredient.description ? ingredient.description : "");
      setSelectedCategory(ingredient.categoryId);
      setSelectedStore(ingredient.storeId);
    }
  }, [ingredient]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {onClose();clearFields();}}
      title={`${ingredient ? "Edit" : "Add"} Ingredient`}
      footerButtons={ingredient ? editButtonConfig : addButtonConfig}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", margin: "20px 0" }}>
        { ingredient ? 
          <div>{ingredient.name}</div> 
          : 
          <Search 
            searchRef={inputRef}
            search={search}
            setSearch={setSearch}
            setSelected={setSelected}
            searchMethod={handleSearch}
            noResultsMessage="Item not found. Create new one?"
            noResultsAction={handleCreateIngredient}
          />
        }
        <textarea
          id="ingredient-description"
          placeholder="Description (optional)"
          value={description}
          className="input-field"
          onChange={(e) => setDescription(e.target.value)}
          style={{
            fontFamily: "Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif",
            maxWidth: "100%",
            minWidth: "100%",
            height: "80px"
          }}
        />
      </div>
      { ingredient &&
        <div>
          <hr/>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", margin: "20px 0" }}>
            <div>
              <h3 style={{ margin: "0 0 8px" }}>Category</h3>
              <DropdownSelect 
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>
            <div>
              <h3 style={{ margin: "0 0 8px" }}>Store</h3>
              <DropdownSelect 
                options={stores}
                value={selectedStore}
                onChange={setSelectedStore}
              />
            </div>
          </div>
        </div>
      }
    </Modal>
  );
}

export default IngredientModal;