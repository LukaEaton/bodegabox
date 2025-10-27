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

  async addIngredientToList(ingredient: PendingIngredient) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/addToList`, {
        method: "POST",
        body: ingredient,
        headers: {
            "Content-Type": "application/json",
        },
    });
  },

  async editListIngredient(ingredient: PendingIngredient) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/editList`, {
        method: "PUT",
        body: ingredient,
        headers: {
            "Content-Type": "application/json",
        },
    });
  },

  async purchase(ingredientId: number) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/purchase`, {
        method: "PUT",
        body: ingredientId,
        headers: {
            "Content-Type": "application/json",
        },
    });
  },

  async revertPurchase(ingredientId: number) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/revertPurchase`, {
        method: "PUT",
        body: ingredientId,
        headers: {
            "Content-Type": "application/json",
        },
    });
  }
};

export default IngredientService;
