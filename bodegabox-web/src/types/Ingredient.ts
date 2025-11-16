export interface Ingredient {
  id: number;
  name: string;
  categoryId: number | null;
  storeId: number | null;
  description?: string;
  valid?: boolean;
}

export interface PendingIngredient {
  ingredientId: number;
  description?: string;
}