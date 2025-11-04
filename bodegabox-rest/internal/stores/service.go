package stores

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

// GetAll gets all stores in the db
func (s *Service) GetAll() ([]Store, error) {
	rows, err := s.db.Query(`SELECT id, name FROM stores`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var stores []Store
	for rows.Next() {
		var store Store
		if err := rows.Scan(&store.ID, &store.Name); err != nil {
			return nil, err
		}
		stores = append(stores, store)
	}
	return stores, rows.Err()
}

// SearchStores gets all the stores in the db with a similar name as the search query
func (s *Service) SearchStores(query string) ([]Store, error) {
	rows, err := s.db.Query(`
		SELECT id, name
		FROM stores
		WHERE name ILIKE '%' || $1 || '%'
	`, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	stores := []Store{}
	for rows.Next() {
		var store Store
		if err := rows.Scan(&store.ID, &store.Name); err != nil {
			return nil, err
		}
		stores = append(stores, store)
	}
	return stores, nil
}

// UpdateStore updates a store's name.
func (s *Service) UpdateStore(id int, name string) (*Store, error) {
	_, err := s.db.Exec(`UPDATE stores SET name = $1 WHERE id = $2`, name, id)
	if err != nil {
		return nil, err
	}
	return &Store{ID: id, Name: name}, nil
}

// CreateStore creates a new store.
func (s *Service) CreateStore(name string) (*Store, error) {
	var id int
	err := s.db.QueryRow(`INSERT INTO stores (name) VALUES ($1) RETURNING id`, name).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &Store{ID: id, Name: name}, nil
}

// DeleteStore deletes a store by ID.
func (s *Service) DeleteStore(id int) error {
	_, err := s.db.Exec(`DELETE FROM stores WHERE id = $1`, id)
	return err
}

// verifyStoreExists checks if a store exists by ID.
func (s *Service) VerifyStoreExists(id int) (bool, error) {
	var count int
	err := s.db.QueryRow(`SELECT COUNT(*) FROM stores WHERE id = $1`, id).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// VerifyStoreExistsByName checks if a store exists by name.
func (s *Service) VerifyStoreExistsByName(name string) (bool, error) {
	var count int
	err := s.db.QueryRow(`SELECT COUNT(*) FROM stores WHERE name = $1`, name).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}