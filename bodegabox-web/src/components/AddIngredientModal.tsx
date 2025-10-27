import { useRef, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IngredientService } from "../services";
import { Ingredient, PendingIngredient } from "../types";

type AddIngredientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (ingredient: PendingIngredient) => void;
}

export function AddIngredientModal({ isOpen, onClose, onAdd }: AddIngredientModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [results, setResults] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [description, setDescription] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if(search.trim().length < 2) {
      setResults([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      setLoading(true);
      IngredientService.searchIngredients(search)
        .then(data => setResults(data))
        .catch(error => console.error("Error searching ingredients:", error))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  if (!isOpen) return null;

  const clearFields = () => {
    setSearch("");
    setSelected(null);
    setDescription("");
  }

  const handleAdd = () => {
    onAdd({ ingredientId: selected!.id, description: description.trim()})
    clearFields();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 style={{margin: "0px"}}>Add Ingredient</h2>
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
          <div style={{ position: "relative" }} ref={searchContainerRef}>
            <input
              type="search"
              placeholder="Search Ingredients..."
              value={search}
              ref={inputRef}
              onChange={(e) => {
                setSelected(null);
                setSearch(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="input-field"
              style={{ width: "100%" }}
            />
            {showResults && results.length > 0 && (
              <div className="floating-results">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <ul>
                    {results.map((ingredient) => (
                      <li 
                        key={ingredient.id} 
                        onClick={() => {
                          setSelected(ingredient);
                          setSearch(ingredient.name);
                          setShowResults(false);
                        }}
                      >{ingredient.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
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
          <button 
            onClick={handleAdd}
            className={`add-button ${!selected ? "disabled-button" : "enabled-button"}`}
            disabled={!selected}
          >
            <FaCirclePlus style={{ marginRight: "5px" }} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddIngredientModal;