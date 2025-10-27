import { RequestService } from "../services";
import { Ingredient, PendingIngredient } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const IngredientService = {
  async getSavedIngredients(): Promise<Ingredient[]> {
    return await RequestService.apiRequest<Ingredient[]>(`${apiBaseUrl}/ingredients/saved`);
  },

  async searchIngredients(query: string): Promise<Ingredient[]> {
    return await RequestService.apiRequest<Ingredient[]>(`${apiBaseUrl}/ingredients/search?q=${encodeURIComponent(query)}`);
  },

  async addIngredient(ingredient: PendingIngredient) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/addToList`, {
        method: "POST",
        body: ingredient,
        headers: {
            "Content-Type": "application/json",
        },
    });
  }
};

export default IngredientService;
