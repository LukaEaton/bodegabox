import { useRef, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { BsPencilSquare } from "react-icons/bs";
import { IngredientService } from "../services";
import { Ingredient, PendingIngredient, Option } from "../types";
import { Search, DropdownSelect } from ".";
import { useAlert } from "../context/AlertContext";

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

  if (!isOpen) return null;

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
  }

  const handleAdd = () => {
    onAdd({ ingredientId: selected!, description: description.trim()})
    clearFields();
  };

  const handleEdit = () => {
    if((selectedCategory && selectedCategory !== ingredient!.categoryId) ||
       (selectedStore && selectedStore !== ingredient!.storeId)) {
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
  }

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
  }

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
    <div className="modal-overlay">
      <div className="modal-container">

        <div className="modal-header">
          <h2 style={{margin: "0px"}}>{ingredient ? "Edit" : "Add"} Ingredient</h2>
          <button 
            className="close-button" 
            onClick={() => {
              onClose(); 
              clearFields();
            }}
          ><FaTimes /></button>
        </div>

        <hr/>

        <div>
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

        </div>

        <hr/>

        <div className="modal-footer">
          {ingredient ? 
            <button 
              onClick={handleEdit}
              className="add-button enabled-button"
            >
              <BsPencilSquare style={{ marginRight: "5px" }} />
              Edit
            </button>
            :
            <button 
              onClick={handleAdd}
              className={`add-button ${!selected ? "disabled-button" : "enabled-button"}`}
              disabled={!selected}
            >
              <FaCirclePlus style={{ marginRight: "5px" }} />
              Add
            </button>
          }
        </div>
      </div>
    </div>
  );
}

export default IngredientModal;