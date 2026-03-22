import { useState, useEffect, useRef } from "react";
import { Modal, ImageUpload, RecipeIngredientCard, Search } from "../components";
import { Recipe, RecipeIngredient, Option } from "../types";
import { IngredientService, RecipeService } from "../services";
import { useAlert } from "../context/AlertContext";
import { FaPlus, FaSave, FaTrashAlt, FaTimes, FaCheck } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { ActionButtonConfig } from "./ActionButton";

type RecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipeId: number | null;
  callBack?: () => void;
}

const apiBaseUrl = import.meta.env.VITE_API_URL;

export function RecipeModal({ isOpen, onClose, recipeId, callBack }: RecipeModalProps) {
  const { setAlert } = useAlert();
  const [editMode, setEditMode] = useState<boolean>(recipeId ? false : true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [webUrl, setWebUrl] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [showNewIngredient, setShowNewIngredient] = useState<boolean>(false);
  const [newIngredientId, setNewIngredientId] = useState<number | null>(null);
  const [newIngredientName, setNewIngredientName] = useState<string>("");
  const [newIngredientDescription, setNewIngredientDescription] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const clearFields = () => {
    setName("");
    setDescription("");
    setWebUrl("");
    setNewIngredientId(null);
    setNewIngredientName("");
    setNewIngredientDescription("");
  };

  const closeModal = () => {
    clearFields();
    setRecipe(null);
    setRecipeIngredients([]);
    onClose();
  };

  const getRecipe = () => {
    if (recipeId) {
      RecipeService.getRecipe(recipeId).then(recipe => {
        setRecipe(recipe); getRecipeIngredients(recipeId);
      })
        .catch(e => { setAlert(e.message); onClose(); });
    }
  };

  const createRecipe = () => {
    if (!name) {
      setAlert("Name is required");
      return;
    }
    RecipeService.createRecipe({ name, description, imageUrl: null, webUrl })
      .then(recipe => {
        clearFields();
        setRecipe(recipe);
        uploadRecipeImage(recipe.id);
        setEditMode(false);
        setAlert("Recipe Created!", "Success");
        callBack?.();
      }).catch(e => setAlert(e.message));
  };

  const updateRecipe = () => {
    if (recipe) {
      RecipeService.updateRecipe(recipe).then(() => {
        uploadRecipeImage(recipe.id);
        setAlert("Recipe Saved!", "Success");
        getRecipe(); callBack?.();
      }).catch(e => setAlert(e.message));
    }
  };

  const saveRecipe = () => {
    return recipe ? updateRecipe() : createRecipe();
  };

  const deleteRecipe = () => {
    if (recipe) {
      RecipeService.deleteRecipe(recipe.id).then(() => {
        setAlert("Recipe Deleted!", "Success");
        callBack?.();
        onClose();
      }).catch(e => setAlert(e.message));
    }
  };

  const uploadRecipeImage = async (id: number): Promise<void> => {
  if (image) {
    try {
      await RecipeService.uploadRecipeImage(id, image);
    } catch (e: any) {
      setAlert(e.message);
    }
  }
};

  const getRecipeIngredients = (id: number) => {
    RecipeService.getRecipeIngredients(id).then(results => setRecipeIngredients(results))
      .catch(e => setAlert(e.message));
  };

  const addRecipeIngredient = () => {
    if (recipe && newIngredientId) {
      RecipeService.addRecipeIngredient({
        recipeId: recipe.id,
        ingredientId: newIngredientId,
        description: newIngredientDescription
      }).then(() => setAlert("Ingredient Added!"))
        .catch(e => setAlert(e.message));
    }
  }

  const updateRecipeIngredient = (ri: RecipeIngredient) => {
    RecipeService.updateRecipeIngredient(ri).then(() => getRecipeIngredients(recipe!.id))
      .catch(e => setAlert(e.message));
  };

  const deleteRecipeIngredient = (ri: RecipeIngredient) => {
    RecipeService.deleteRecipeIngredient(ri.recipeId, ri.ingredientId)
      .then(() => getRecipeIngredients(recipe!.id))
      .catch(e => setAlert(e.message));
  };

  const handleSearch = async (input: string): Promise<Option[]> => {
    try {
      const ingredients = await IngredientService.searchIngredients(input);
      return ingredients.map(ingredient => ({ value: ingredient.id, label: ingredient.name, }));
    } catch (error) {
      console.error("Failed to Search for Ingredients:", error); return [];
    }
  };

  const saveActionButton: ActionButtonConfig = {
    label: "Save",
    icon: <FaSave />,
    onClick: saveRecipe,
    className: "add-button bg-none"
  };

  const cancelEditButton: ActionButtonConfig = {
    icon: <FaTimes />,
    onClick: () => setEditMode(false),
    className: "add-button bg-none"
  };

  const actionButtons: ActionButtonConfig[] = [
    {
      icon: <BsPencilSquare />,
      onClick: () => setEditMode(true),
      className: "add-button bg-none"
    },
    {
      icon: <FaTrashAlt />,
      onClick: () => setDeleteConfirmation(true),
      className: "add-button delete-button"
    }
  ];

  useEffect(() => {
    if (recipeId) {
      setEditMode(false);
      getRecipe();
    }
  }, [recipeId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={recipe ? recipe.name : "Add Recipe"}
      containerClass="recipe-modal"
      footerButtons={editMode ? recipe ? [saveActionButton, cancelEditButton] : [saveActionButton] : actionButtons}
    >
      {editMode ?
        <>
          <ImageUpload onFileSelect={setImage} />
          <h4 style={{ margin: "15px 0 7px" }}>Recipe Title</h4>
          <input
            id="recipe-title"
            type="text"
            className="input-field"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <h4 style={{ margin: "15px 0 7px" }}>Description/Steps</h4>
          <textarea
            id="recipe-description"
            placeholder="Description (optional)"
            value={description}
            className="input-field"
            onChange={(e) => setDescription(e.target.value)}
            style={{ fontFamily: "Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif", maxWidth: "100%", minWidth: "100%", height: "300px" }}
          />
        </> : recipe ?
          <>
            <img src={`${apiBaseUrl}/${recipe.imageUrl}`} alt={recipe.name} />
            <div>{recipe.description}</div>
          </> : null
      }

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4 style={{ margin: "15px 0 7px" }}>Ingredients:</h4>
        <FaPlus onClick={() => {
          if (recipe) {
            setShowNewIngredient(true);
          } else {
            setAlert("Requires saved recipe to add ingredients!");
          }
        }}
        />
      </div>
      <div className={`ingredient-card ingredient-panel ${showNewIngredient ? "enter" : "exit"}`}>
        <div style={{padding: "8px", borderRadius: "5px", display: "flex", flexDirection: "column", gap: "10px"}}> 
          <Search 
            searchRef={inputRef} 
            search={newIngredientName} 
            setSearch={setNewIngredientName} 
            setSelected={setNewIngredientId} 
            searchMethod={handleSearch} 
          /> 
          <textarea 
            placeholder="Description (optional)" 
            className="input-field" 
            value={newIngredientDescription} 
            onChange={e => setNewIngredientDescription(e.target.value)} 
            style={{ 
              fontFamily: "Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif", 
              maxWidth: "100%", 
              minWidth: "100%", 
              height: "50px" 
            }} 
          /> 
        </div> 
        <div style={{ justifyContent: "right", display: "flex", gap: "10px", alignItems: "center", padding: "0px 10px 10px 0px" }}> 
          <FaCheck style={{ cursor: "pointer" }} onClick={addRecipeIngredient} /> 
          <FaTimes style={{ cursor: "pointer" }} onClick={() => setShowNewIngredient(false)} /> 
        </div> 
      </div> 
      
      { recipe && recipeIngredients.map(ri => 
        <RecipeIngredientCard 
          ri={ri} 
          updateRecipeIngredient={updateRecipeIngredient} 
          deleteRecipeIngredient={deleteRecipeIngredient} 
        />)
      } 
      
      <Modal 
        isOpen={deleteConfirmation} 
        onClose={() => setDeleteConfirmation(false)} 
        title="Delete Confirmation" 
        containerClass="" 
        footerButtons={[{ label: "Delete", icon: <FaTrashAlt />, onClick: deleteRecipe, className: "add-button delete-button" }]} 
      > Are you sure you want to delete this recipe? </Modal> 

    </Modal >
  );
}