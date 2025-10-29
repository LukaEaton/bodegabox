package ingredients

import (
	"database/sql"
	"errors"
)

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{
		db: db,
	}
}

// GetAll returns all ingredients from the database.
func (s *Service) GetAll() ([]Ingredient, error) {
	rows, err := s.db.Query(`SELECT id, name, category_id, store_id FROM ingredients`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	ingredients := []Ingredient{}
	for rows.Next() {
		var ing Ingredient
		if err := rows.Scan(&ing.ID, &ing.Name, &ing.CategoryID, &ing.StoreID); err != nil {
			return nil, err
		}
		ingredients = append(ingredients, ing)
	}
	return ingredients, rows.Err()
}

// GetAllSaved returns all saved ingredients from the shopping list.
func (s *Service) GetAllSaved() ([]SavedIngredient, error) {
	rows, err := s.db.Query(`SELECT i.id, i.name, i.category_id, i.store_id, si.description, si.valid FROM ingredients i JOIN saved_ingredients si ON i.id = si.ingredient_id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	savedIngredients := []SavedIngredient{}
	for rows.Next() {
		var si SavedIngredient
		var description sql.NullString
		if err := rows.Scan(&si.ID, &si.Name, &si.CategoryID, &si.StoreID, &description, &si.Valid); err != nil {
			return nil, err
		}
		if description.Valid {
			si.Description = description.String
		}
		savedIngredients = append(savedIngredients, si)
	}
	return savedIngredients, nil
}

// GetByID returns a single ingredient by ID from the database.
func (s *Service) GetByID(id int) (Ingredient, error) {
	var ing Ingredient
	err := s.db.QueryRow(
		`SELECT id, name, category_id, store_id FROM ingredients WHERE id = $1`, id,
	).Scan(&ing.ID, &ing.Name, &ing.CategoryID, &ing.StoreID)
	if err == sql.ErrNoRows {
		return Ingredient{}, errors.New("ingredient not found")
	}
	return ing, err
}

// Search for Ingredients by name.
func (s *Service) SearchIngredients(query string) ([]Ingredient, error) {
	rows, err := s.db.Query(`
		SELECT id, name, category_id, store_id 
		FROM ingredients 
		WHERE name ILIKE '%' || $1 || '%'
	`, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	ingredients := []Ingredient{}
	for rows.Next() {
		var ing Ingredient
		if err := rows.Scan(&ing.ID, &ing.Name, &ing.CategoryID, &ing.StoreID); err != nil {
			return nil, err
		}
		ingredients = append(ingredients, ing)
	}
	return ingredients, nil
}

// AddToShoppingList adds an ingredient to the shopping list.
func (s *Service) AddToShoppingList(ingredientID int, description string) error {
	_, err := s.db.Exec(
		`INSERT INTO saved_ingredients (ingredient_id, description) VALUES ($1, $2)`,
		ingredientID, 	description,
	)
	return err
}

// EditShoppingList edits an ingredient's description on the list
func (s *Service) EditShoppingList(ingredientID int, description string) error {
	_, err := s.db.Exec(
		`UPDATE saved_ingredients 
			SET description = $2
			WHERE ingredient_id = $1`,
		ingredientID, 	description,
	)
	return err
}

// InvalidateIngredient invalidates a list ingredient
func (s *Service) InvalidateIngredient(ingredientID int) error {
	_, err := s.db.Exec(
		`UPDATE saved_ingredients 
			SET valid = FALSE,
				saved = CURRENT_TIMESTAMP
			WHERE ingredient_id = $1`,
		ingredientID,
	)
	return err
}

// ReValidateIngredient re-validates a list ingredient
func (s *Service) ReValidateIngredient(ingredientID int) error {
	_, err := s.db.Exec(
		`UPDATE saved_ingredients 
			SET valid = TRUE
			WHERE ingredient_id = $1`,
		ingredientID,
	)
	return err
}

// VerifySavedIngredientExists 
func (s *Service) VerifySavedIngredientExists(ingredientID int, valid bool) (int, error) {
	var count int
	err := s.db.QueryRow(`
		SELECT COUNT(*) 
		FROM saved_ingredients 
		WHERE ingredient_id = $1 AND valid = $2
	`, ingredientID, valid).Scan(&count)
	if err != nil {
		return -1, err
	}
	return count, nil
}

// UpdateIngredientDetails updates an ingredient's name/category/store.
func (s *Service) UpdateIngredientDetails(ingredient Ingredient) error {
	_, err := s.db.Exec(
		`UPDATE ingredients
			SET name = $2,
				category_id = $3,
				store_id = $4
			WHERE id = $1`,
		ingredient.ID,
		ingredient.Name,
		ingredient.CategoryID,
		ingredient.StoreID,
	)
	return err
}

// Create adds a new ingredient to the database.
func (s *Service) Create(name string, categoryID, storeID int) (Ingredient, error) {
	var id int
	err := s.db.QueryRow(
		`INSERT INTO ingredients (name, category_id, store_id) VALUES ($1, $2, $3) RETURNING id`,
		name, categoryID, storeID,
	).Scan(&id)
	if err != nil {
		return Ingredient{}, err
	}
	return Ingredient{
		ID:         id,
		Name:       name,
		CategoryID: categoryID,
		StoreID:    storeID,
	}, nil
}
