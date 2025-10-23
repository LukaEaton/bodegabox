import { apiRequest } from "./RequestService";

export interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  storeId: number;
  description?: string;
}

const apiBaseUrl = import.meta.env.VITE_API_URL;

const IngredientService = {
  async getIngredients(): Promise<Ingredient[]> {
    try {
        const data = await apiRequest<Ingredient[]>(`${apiBaseUrl}/ingredients/saved/`);
        return data;
    } catch (error) {
        console.error("Error fetching ingredients:", error);
        return [];
    }
  }
};

export default IngredientService;
