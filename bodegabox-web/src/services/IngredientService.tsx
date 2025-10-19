export interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  storeId: number;
  description?: string;
}

const API_BASE_URL = "http://localhost:8080";

const IngredientService = {
  async fetchIngredients(): Promise<Ingredient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredients/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ingredients: ${response.statusText}`);
      }
      const data: Ingredient[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      return [];
    }
  },

  async fetchIngredientById(id: number): Promise<Ingredient | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredients/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ingredient ${id}: ${response.statusText}`);
      }
      const ingredient: Ingredient = await response.json();
      return ingredient;
    } catch (error) {
      console.error(`Error fetching ingredient ${id}:`, error);
      return null;
    }
  },
};

export default IngredientService;
