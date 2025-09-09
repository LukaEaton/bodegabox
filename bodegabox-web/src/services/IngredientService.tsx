export interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  storeId: number;
  description?: string;
}

const IngredientService = {
    async fetchIngredients(): Promise<Ingredient[]> {
        // TODO: Fetch ingredients from backend
        const allIngredientsList = [
            { id: 1, name: "Apples", categoryId: 1, storeId: 1, description: "Fresh and crispy" },
            { id: 2, name: "Bananas", categoryId: 1, storeId: 2 },
            { id: 3, name: "Carrots", categoryId: 1, storeId: 3 },
            { id: 4, name: "Milk", categoryId: 2, storeId: 1, description: "2% Fat" },
            { id: 5, name: "Cheese", categoryId: 2, storeId: 2 },
            { id: 6, name: "Bread", categoryId: 3, storeId: 3, description: "Whole grain" },
            { id: 7, name: "Chicken", categoryId: 4, storeId: 1 },
            { id: 8, name: "Beef", categoryId: 4, storeId: 2, description: "Grass-fed" },
            { id: 9, name: "Soda", categoryId: 5, storeId: 1 },
            { id: 10, name: "Juice", categoryId: 5, storeId: 3 }
        ];
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return allIngredientsList;
    }

}

export default IngredientService;