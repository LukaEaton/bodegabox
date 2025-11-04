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
        body: ingredient
    });
  },

  async editListIngredient(ingredient: PendingIngredient) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/editList`, {
        method: "PUT",
        body: ingredient
    });
  },

  async purchase(ingredientId: number) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/purchase`, {
        method: "PUT",
        body: ingredientId
    });
  },

  async revertPurchase(ingredientId: number) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/revertPurchase`, {
        method: "PUT",
        body: ingredientId
    });
  },

  async updateIngredient(ingredient: Ingredient) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/`, {
        method: "PUT",
        body: ingredient
    });
  },

  async deleteIngredient(ingredientId: number) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/${ingredientId}/`, {
        method: "DELETE"
    });
  },

  async createIngredient(ingredient: Partial<Ingredient>) {
    await RequestService.apiRequest(`${apiBaseUrl}/ingredients/`, {
        method: "POST",
        body: ingredient
    });
  }
};

export default IngredientService;
