import { useState, useEffect } from "react";
import { TabHeader, PullToRefresh, RecipeCard, FloatingButton, RecipeModal } from "../components";
import { Recipe } from "../types";
import { RecipeService } from "../services";
import { useAlert } from "../context/AlertContext"
import { FaPlus } from "react-icons/fa";

export function RecipesPage() {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState<string>("");
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [recipeModalOpen, setRecipeModalOpen] = useState<boolean>(false); 
    const { setAlert } = useAlert();

    const getRecipes = () => {
        RecipeService.getRecipes()
            .then(results => setRecipes(results))
            .catch((e) => setAlert(e.message));
    };

    useEffect(() => {
        if(search.length > 2){
            RecipeService.searchRecipe(search)
                .then(results => setRecipes(results))
                .catch((e) => setAlert(e.message));
        }
    }, [search])

    useEffect(() => {
        getRecipes();
    },[])

    return (
        <div className="tab">
            <TabHeader title="Recipes" />
            <div>
                <input 
                    type="search" 
                    placeholder="Search Recipes..."
                    className="input-field"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <PullToRefresh onRefresh={getRecipes}>
                {recipes.map(recipe => (
                    <RecipeCard recipe={recipe} onClick={() => { setSelectedRecipe(recipe); setRecipeModalOpen(true); }} />
                ))}
            </PullToRefresh>
            <FloatingButton onClick={() => {setSelectedRecipe(null); setRecipeModalOpen(true);}}>
                <FaPlus size={24} />
            </FloatingButton>
            <RecipeModal
                isOpen={recipeModalOpen}
                onClose={() => setRecipeModalOpen(false)}
                recipeId={selectedRecipe?.id || null}
            />
        </div>
    );
}