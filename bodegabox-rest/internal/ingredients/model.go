package ingredients

import "encoding/json"

type Ingredient struct {
	ID         int    `json:"id" db:"id"`
	Name       string `json:"name" db:"name"`
	CategoryID *int    `json:"categoryId" db:"category_id"`
	StoreID    *int    `json:"storeId" db:"store_id"`
}

type SavedIngredient struct {
	ID          int    `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	CategoryID  *int    `json:"categoryId" db:"category_id"`
	StoreID     *int    `json:"storeId" db:"store_id"`
	Description string `json:"description" db:"description"`
	Valid       bool   `json:"valid" db:"valid"`
}

type PendingIngredient struct {
	IngredientID json.Number `json:"ingredientId" db:"ingredient_id"`
	Description  string  `json:"description" db:"description"`
}