package categories

import (
	"database/sql"
)

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{
		db: db,
	}
}

// GetAll returns all categories from the database.
func (s *Service) GetAll() ([]Category, error) {
	rows, err := s.db.Query(`SELECT id, name FROM categories`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var category Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}
	return categories, rows.Err()
}

// SearchCategories searches for categories by name.
func (s *Service) SearchCategories(query string) ([]Category, error) {
	rows, err := s.db.Query(`
		SELECT id, name 
		FROM categories 
		WHERE name ILIKE '%' || $1 || '%'
	`, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	categories := []Category{}
	for rows.Next() {
		var category Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}
	return categories, nil
}