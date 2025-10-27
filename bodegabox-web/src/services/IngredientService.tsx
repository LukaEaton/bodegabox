import { apiRequest } from "./RequestService";

export interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  storeId: number;
  description?: string;
  valid?: boolean;
}

export interface PendingIngredient {
  ingredientId: number;
  description: string;
}

const apiBaseUrl = import.meta.env.VITE_API_URL;

const IngredientService = {
  async getSavedIngredients(): Promise<Ingredient[]> {
    return await apiRequest<Ingredient[]>(`${apiBaseUrl}/ingredients/saved`);
  },

  async searchIngredients(query: string): Promise<Ingredient[]> {
    return await apiRequest<Ingredient[]>(`${apiBaseUrl}/ingredients/search?q=${encodeURIComponent(query)}`);
  },

  async addIngredient(ingredient: PendingIngredient) {
    await apiRequest(`${apiBaseUrl}/ingredients/addToList`, {
        method: "POST",
        body: ingredient,
        headers: {
            "Content-Type": "application/json",
        },
    });
  }
};

export default IngredientService;
