export interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  storeId: number;
  description?: string;
  valid?: boolean;
}