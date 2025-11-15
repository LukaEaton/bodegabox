package recipes

type Recipe struct {
	ID         int    `json:"id" db:"id"`
	Name       string `json:"name" db:"name"`
	Description	string `json:"description" db:"description"`
	ImageUrl	string `json:"imageUrl" db:"image_url"`
	WebUrl		string `json:"webUrl" db:"web_url"`
}

type RecipeIngredient struct {
	RecipeID	int 	`json:"recipeId" db:"recipe_id"`
	IngredientID	int	`json:"ingredientId" db:"ingredient_id"`
	Description	string `json:"description" db:"description"`
}

type RecipeIngredientDTO struct {
	RecipeID	int 	`json:"recipeId" db:"recipe_id"`
	IngredientID	int	`json:"ingredientId" db:"ingredient_id"`
	Name       string `json:"name" db:"name"`
	Description	string `json:"description" db:"description"`
}