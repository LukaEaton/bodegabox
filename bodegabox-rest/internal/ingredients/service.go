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

	var ingredients []Ingredient
	for rows.Next() {
		var ing Ingredient
		if err := rows.Scan(&ing.ID, &ing.Name, &ing.CategoryID, &ing.StoreID); err != nil {
			return nil, err
		}
		ingredients = append(ingredients, ing)
	}
	return ingredients, rows.Err()
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
