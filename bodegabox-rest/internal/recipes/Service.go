package recipes

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

// GetAll returns all recipes from the database
func (s *Service) GetAll() ([]Recipe, error) {
	rows, err := s.db.Query(`SELECT id, name, description, image_url, web_url FROM recipes`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	recipes := []Recipe{}
	for rows.Next() {
		var recipe Recipe
		if err := rows.Scan(&recipe.ID, &recipe.Name, &recipe.Description, &recipe.ImageUrl, &recipe.WebUrl); err != nil {
			return nil, err
		}
		recipes = append(recipes, recipe)
	}
	return recipes, rows.Err()
}

// GetRecipe returns the recipe by the specified ID
func (s *Service) GetRecipe(id int) (Recipe, error) {
	var recipe Recipe
	err := s.db.QueryRow(`
		SELECT id, name, description, image_url, web_url
		FROM recipes
		WHERE id = $1
	`, id).Scan(&recipe.ID, &recipe.Name, &recipe.Description, &recipe.ImageUrl, &recipe.WebUrl)
	if err != nil {
		return Recipe{}, err
	}
	return recipe, nil
}

// CreateRecipe creates the given recipe
func (s *Service) CreateRecipe(name string, description string, imageUrl string, webUrl string) (Recipe, error) {
	var id int
	err := s.db.QueryRow(
		`INSERT INTO recipes (name, description, image_url, web_url) VALUES ($1, $2, $3, $4) RETURNING id`,
		name, description, imageUrl, webUrl,
	).Scan(&id)
	if err != nil {
		return Recipe{}, err
	}
	return Recipe {
		ID:				id,
		Name:			name,
		Description:	description,
		ImageUrl:		imageUrl,
		WebUrl:			webUrl,
	}, nil
}

// UpdateRecipe updates the given recipe
func (s *Service) UpdateRecipe(recipe Recipe) error {
	_, err := s.db.Exec(
		`UPDATE recipes
			SET name = $2,
				description = $3,
				image_url = $4,
				web_url = $5
			WHERE id = $1`,
			recipe.ID,
			recipe.Name,
			recipe.Description,
			recipe.ImageUrl,
			recipe.WebUrl,
	)
	return err
}

// DeleteRecipe deletes the given recipe
func (s *Service) DeleteRecipe(id int) error {
	_, err := s.db.Exec(`DELETE FROM recipes WHERE id = $1`, id)
	return err
}

// GetRecipeIngredients gets all the ingredients to a recipe
func (s *Service) GetRecipeIngredients(id int) ([]RecipeIngredientDTO, error) {
	rows, err := s.db.Query(`
		SELECT r.recipe_id, r.ingredient_id, i.name, r.description
		FROM recipe_ingredients r JOIN ingredients i ON r.ingredient_id = i.id
		WHERE r.reciped_id = $1
	`, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	recipeIngredients := []RecipeIngredientDTO{}
	for rows.Next() {
		var r RecipeIngredientDTO
		if err := rows.Scan(&r.RecipeID, &r.IngredientID, &r.Name, &r.Description); err != nil {
			return nil, err
		}
		recipeIngredients = append(recipeIngredients, r)
	}
	return recipeIngredients, rows.Err()
}

// AddRecipeIngredient adds an ingredient to a recipe
func (s *Service) AddRecipeIngredient(ri RecipeIngredient) error {
	_, err := s.db.Exec(
		`INSERT INTO recipe_ingredients (recipe_id, ingredient_id, description)
			VALUES ($1, $2, $3)`, ri.RecipeID, ri.IngredientID, ri.Description,
	)
	return err
}

// DeleteRecipeIngredient removes the given ingredient from the given recipe
func (s *Service) DeleteRecipeIngredient(recipeId int, ingredientId int) error {
	_, err := s.db.Exec(`
		DELETE FROM recipe_ingredients 
		WHERE recipe_id = $1 and ingredient_id = $2
	`, recipeId, ingredientId)
	return err
}

// EditRecipeIngredient edits the description associated with a recipe ingredient
func (s *Service) EditRecipeIngredient(ri RecipeIngredient) error {
	_, err := s.db.Exec(
		`UPDATE recipe_ingredients
			SET description = $3
			WHERE recipe_id = $1
				AND ingredient_id = $2
	`, ri.RecipeID, ri.IngredientID, ri.Description)
	return err
}

// VerifyRecipeExists checks if the given recipe is already in the DB
func (s *Service) VerifyRecipeExists(id int) (bool, error) {
	var count int
	err := s.db.QueryRow(`SELECT COUNT(*) FROM recipes WHERE id = $1`, id).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}