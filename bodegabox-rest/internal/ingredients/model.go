package ingredients

// Ingredient represents a food ingredient in the system.
type Ingredient struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	CategoryID int    `json:"categoryId"`
	StoreID    int    `json:"storeId"`
}