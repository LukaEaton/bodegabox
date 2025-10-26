import { apiRequest } from "./RequestService";

export interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  storeId: number;
  description?: string;
}

export interface PendingIngredient {
  ingredientId: number;
  description: string;
}

const apiBaseUrl = import.meta.env.VITE_API_URL;

const IngredientService = {
  async getSavedIngredients(): Promise<Ingredient[]> {
    try {
        const data = await apiRequest<Ingredient[]>(`${apiBaseUrl}/ingredients/saved`);
        return data;
    } catch (error) {
        console.error("Error fetching ingredients:", error);
        return [];
    }
  },

  async searchIngredients(query: string): Promise<Ingredient[]> {
    try {
        const data = await apiRequest<Ingredient[]>(`${apiBaseUrl}/ingredients/search?q=${encodeURIComponent(query)}`);
        return data;
    } catch (error) {
        console.error("Error searching ingredients:", error);
        return [];
    }
  },

  async addIngredient(ingredient: PendingIngredient) {
    try {
        await apiRequest(`${apiBaseUrl}/ingredients/addToList`, {
            method: "POST",
            body: ingredient,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    catch (error) {
        console.error("Error adding ingredient:", error);
    }
  }
};

export default IngredientService;
