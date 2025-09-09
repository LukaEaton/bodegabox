package ingredients

import (
	"errors"
)

// Service defines business logic for managing ingredients.
type Service struct {
	data map[int]Ingredient // in-memory store for simplicity
	next int                // auto-incrementing ID
}

// NewService creates a new ingredient service.
func NewService() *Service {
	return &Service{
		data: make(map[int]Ingredient),
		next: 1,
	}
}

// GetAll returns all ingredients.
func (s *Service) GetAll() []Ingredient {
	ingredients := make([]Ingredient, 0, len(s.data))
	for _, ing := range s.data {
		ingredients = append(ingredients, ing)
	}
	return ingredients
}

// GetByID returns a single ingredient by ID.
func (s *Service) GetByID(id int) (Ingredient, error) {
	ing, ok := s.data[id]
	if !ok {
		return Ingredient{}, errors.New("ingredient not found")
	}
	return ing, nil
}

// Create adds a new ingredient.
func (s *Service) Create(name string, categoryID, storeID int) Ingredient {
	ing := Ingredient{
		ID:         s.next,
		Name:       name,
		CategoryID: categoryID,
		StoreID:    storeID,
	}
	s.data[s.next] = ing
	s.next++
	return ing
}
