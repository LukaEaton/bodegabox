package ingredients

type Ingredient struct {
	ID         int    `json:"id" db:"id"`
	Name       string `json:"name" db:"name"`
	CategoryID int    `json:"categoryId" db:"category_id"`
	StoreID    int    `json:"storeId" db:"store_id"`
}