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