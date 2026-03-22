import { Recipe } from "../types";
import { FaLink } from "react-icons/fa";

type RecipeCardProps = {
    recipe: Recipe;
    onClick?: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
    return (
        <div onClick={onClick}>
            <img src={`${recipe.imageUrl}`} />
            <div className="settings-option">
              <h4>{recipe.name}</h4>
              <div>
                {recipe.webUrl && 
                  <a href={recipe.webUrl} target="_blank" rel="noopener noreferrer">
                      <FaLink />
                  </a>
                }
              </div>
            </div>
        </div>
    );
}