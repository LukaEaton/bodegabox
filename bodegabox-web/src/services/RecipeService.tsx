import { RequestService } from "../services";
import { Recipe, RecipeIngredient } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const RecipeService = {
    async getRecipes(): Promise<Recipe[]> {
        return await RequestService.apiRequest<Recipe[]>(`${apiBaseUrl}/recipes/`);
    },

    async getRecipe(id: number): Promise<Recipe> {
        return await RequestService.apiRequest<Recipe>(`${apiBaseUrl}/recipes/${id}`);
    },

    async searchRecipe(query: string): Promise<Recipe[]> {
        return await RequestService.apiRequest<Recipe[]>(`${apiBaseUrl}/recipes/search?q=${encodeURIComponent(query)}`);
    },

    async createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
        return await RequestService.apiRequest<Recipe>(`${apiBaseUrl}/recipes/`, {
            method: "POST",
            body: recipe
        });
    },

    async updateRecipe(recipe: Recipe) {
        await RequestService.apiRequest(`${apiBaseUrl}/recipes/`, {
            method: "PUT",
            body: recipe
        });
    },

    async deleteRecipe(id: number) {
        await RequestService.apiRequest(`${apiBaseUrl}/recipes/${id}`, {
            method: "DELETE"
        });
    },

    async getRecipeIngredients(): Promise<RecipeIngredient[]> {
        return await RequestService.apiRequest(`${apiBaseUrl}/recipes/ingredients`);
    },

    async addRecipeIngredient(ri: Partial<RecipeIngredient>) {
        await RequestService.apiRequest(`${apiBaseUrl}/recipes/ingredients`, {
            method: "POST",
            body: ri
        });
    },

    async updateRecipeIngredient(ri: RecipeIngredient) {
        await RequestService.apiRequest(`${apiBaseUrl}/recipes/ingredients`, {
            method: "PUT",
            body: ri
        });
    },

    async deleteRecipeIngredient(recipeId: number, ingredient_id: number) {
        await RequestService.apiRequest(`${apiBaseUrl}/recipes/ingredients/${recipeId}/${ingredient_id}`, {
            method: "DELETE"
        });
    }
};

export default RecipeService;