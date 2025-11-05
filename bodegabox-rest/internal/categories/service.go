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

// UpdateCategory updates a category's name.
func (s *Service) UpdateCategory(id int, name string) (*Category, error) {
	_, err := s.db.Exec(`UPDATE categories SET name = $1 WHERE id = $2`, name, id)
	if err != nil {
		return nil, err
	}
	return &Category{ID: id, Name: name}, nil
}

// CreateCategory creates a new category.
func (s *Service) CreateCategory(name string) (*Category, error) {
	var id int
	err := s.db.QueryRow(`INSERT INTO categories (name) VALUES ($1) RETURNING id`, name).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &Category{ID: id, Name: name}, nil
}

// DeleteCategory deletes a category by ID.
func (s *Service) DeleteCategory(id int) error {
	_, err := s.db.Exec(`DELETE FROM categories WHERE id = $1`, id)
	return err
}

// verifyCategoryExists checks if a category exists by ID.
func (s *Service) VerifyCategoryExists(id int) (bool, error) {
	var count int
	err := s.db.QueryRow(`SELECT COUNT(*) FROM categories WHERE id = $1`, id).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// VerifyCategoryExistsByName checks if a category exists by name.
func (s *Service) VerifyCategoryExistsByName(name string) (bool, error) {
	var count int
	err := s.db.QueryRow(`SELECT COUNT(*) FROM categories WHERE name = $1`, name).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}