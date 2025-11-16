import { Recipe } from "../types";
import { FaLink } from "react-icons/fa";

type RecipeCardProps = {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <div onClick={() => alert('modal open')} className="">
            <img src={`${recipe.imageUrl}`} />
            <h4>{recipe.name}</h4>
            <p>{recipe.description}</p>
            <div>
                {recipe.webUrl && 
                    <a href={recipe.webUrl} target="_blank" rel="noopener noreferrer">
                        <FaLink />
                    </a>
                }
            </div>
        </div>
    );
}