import { Recipe } from "../types";
import { Modal } from "../components";
import { FaLink } from "react-icons/fa";

type RecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
}

export function RecipeModal({ isOpen, onClose, recipe }: RecipeModalProps) {

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={recipe ? recipe.name : "New Recipe"}
    >
        { recipe ? 
            (
                <>
                    { recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.name} /> }
                    <div className="settings-option">
                        <h2>{recipe.name}</h2>
                        <button onClick={() => window.open(recipe.webUrl || "#", "_blank")}>
                            <FaLink size={16} />
                        </button>
                    </div>
                </>
            ) : 
            (
                <p>Recipe creation coming soon...</p>
            )
        }
    </Modal>
  );
}