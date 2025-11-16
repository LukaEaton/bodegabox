export interface Recipe {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    webUrl: string | null;
}

export interface RecipeIngredient {
    recipeId: number;
    ingredientId: number;
    name: string;
    description: string | null;
}