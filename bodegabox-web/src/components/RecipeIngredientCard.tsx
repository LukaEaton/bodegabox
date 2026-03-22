import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import { RecipeIngredient } from "../types";

type RecipeIngredientCardProps = {
  ri: RecipeIngredient;
  updateRecipeIngredient: (ri: RecipeIngredient) => void;
  deleteRecipeIngredient: (ri: RecipeIngredient) => void;
}

export function RecipeIngredientCard({ ri, updateRecipeIngredient, deleteRecipeIngredient }: RecipeIngredientCardProps) {

  const [editMode, setEditMode] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  return (
    <div
      className="ingredient-card"
      style={{
        display: "flex"
      }}
    >
      <h4 style={{ margin: "0px" }}>{ri.name}</h4>
      {editMode ?
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="input-field" /> :
        <p className="secondary-text" style={{ margin: "0px", fontStyle: "italic", fontSize: "15px" }}>{ri.description}</p>

      }
      <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center", marginRight: "5px" }}>
          { editMode ? 
              <>
                  <FaCheck style={{ cursor: "pointer" }} onClick={() => updateRecipeIngredient({ ...ri, description })} />
                  <FaTimes style={{ cursor: "pointer" }} onClick={() => setEditMode(false)} />
              </>
              :
              <>
                <BsPencilSquare style={{ cursor: "pointer" }} onClick={() => setEditMode(true)} />
                <FaTrash style={{ cursor: "pointer" }} onClick={() => deleteRecipeIngredient(ri)} />
              </>
          }
      </div>
    </div>
  );
}