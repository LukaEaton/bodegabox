import { useRef, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { BsPencilSquare } from "react-icons/bs";
import { IngredientService } from "../services";
import { Ingredient, PendingIngredient, Option } from "../types";
import { Search } from ".";

type IngredientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  onAdd: (ingredient: PendingIngredient) => void;
  onEdit: (ingredient: PendingIngredient) => void;
}

export function IngredientModal({ isOpen, onClose, ingredient, onAdd, onEdit }: IngredientModalProps) {

  if (!isOpen) return null;

  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  const clearFields = () => {
    setSearch("");
    setSelected(null);
    setDescription("");
  }

  const handleAdd = () => {
    onAdd({ ingredientId: selected!, description: description.trim()})
    clearFields();
  };

  const handleEdit = () => {
    onEdit({ ingredientId: ingredient!.id, description: description.trim()})
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
        <div className="modal-body">
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
            placeholder="Description (optional)"
            value={description}
            className="input-field"
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", 
              marginTop: "20px", 
              fontFamily: "Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif",
              maxWidth: "100%",
              minWidth: "100%",
              height: "80px"
            }}
          />
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