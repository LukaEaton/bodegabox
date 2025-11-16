import { useState, useEffect } from "react";
import { TabHeader, PullToRefresh, RecipeCard, FloatingButton } from "../components";
import { Recipe } from "../types";
import { RecipeService } from "../services";
import { useAlert } from "../context/AlertContext"
import { FaPlus } from "react-icons/fa";

export function RecipesPage() {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState<string>("");
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
                    <RecipeCard recipe={recipe} />
                ))}
            </PullToRefresh>
            <FloatingButton onClick={() => {}}>
                <FaPlus size={24} />
            </FloatingButton>
        </div>
    );
}