package recipes 

import ( 
	"bodegabox-rest/internal/ingredients" 
	"database/sql" 
	"log" 
	"net/http" 
	"strconv" 
	"strings" 
	"fmt" 
	"github.com/gin-gonic/gin" 
	"path/filepath"
	"os"
) 
	
const ImageDir = "/app/data/images" 

// RegisterRoutes adds recipe routes to the router group. 
func RegisterRoutes(rg *gin.RouterGroup, service *Service, ingredientService *ingredients.Service) { 
	
	// GET /recipes/ 
	rg.GET("/", func(c *gin.Context) {
		recipes, err := service.GetAll() 
		if err != nil { 
			log.Println(err) 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recipes"}) 
			return 
		}
		c.JSON(http.StatusOK, recipes) 
	}) 
	
	// GET /recipes/:id 
	rg.GET("/:id", func(c *gin.Context) { 
		id, err := strconv.Atoi(c.Param("id")) 
		if err != nil { 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"}) 
			return 
		} 
		recipe, err := service.GetRecipe(id) 
		if err != nil { 
			if err == sql.ErrNoRows { 
				c.JSON(http.StatusNotFound, gin.H{"error": "Recipe doesn't exist"}) 
				return 
			} 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get recipe"}) 
			return 
		} 
		c.JSON(http.StatusOK, recipe) 
	}) 
	
	// GET /recipes?q=<term> 
	rg.GET("/search", func(c *gin.Context) { 
		query := c.Query("q") 
		if query == "" { 
			log.Println("Search query is missing") 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing search query"})
			return 
		} 
		results, err := service.SearchRecipes(query) 
		if err != nil { 
			log.Println(err) 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search Recipes"}) 
			return 
		} 
		c.JSON(http.StatusOK, results) 
	}) 
	
	// POST /recipes 
	rg.POST("/", func(c *gin.Context) { 
		var input struct { 
			Name string `json:"name" db:"name"`
			Description string `json:"description" db:"description"`
			ImageUrl string `json:"imageUrl" db:"image_url"` 
			WebUrl string `json:"webUrl" db:"web_url"` 
		} 
		if err := c.ShouldBindJSON(&input); err != nil { 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"}) 
			return 
		} 
		recipe, err := service.CreateRecipe(input.Name, input.Description, input.ImageUrl, input.WebUrl) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create recipe"}) 
			return 
		} 
		c.JSON(http.StatusCreated, recipe) 
	}) 
	
	// PUT /recipes 
	rg.PUT("/", func(c *gin.Context) { 
		var input Recipe 
		if err := c.ShouldBindJSON(&input); err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid input"}) 
			return 
		}

		exists, err := service.VerifyRecipeExists(input.ID) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if recipe exists"}) 
			return 
		} 
		if !exists { 
			c.JSON(http.StatusNotFound, gin.H{"error": "Recipe doesn't exist"}) 
			return 
		} 

		err = service.UpdateRecipe(input) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update recipe"}) 
			return
		} 
		c.JSON(http.StatusOK, nil) 
	}) 
	
	// DELETE /recipes/:id 
	rg.DELETE("/:id", func(c *gin.Context) { 
		id, err := strconv.Atoi(c.Param("id")) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid Recipe ID"}) 
			return 
		} 
		exists, err := service.VerifyRecipeExists(id) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if recipe exists"}) 
			return 
		} 
		if !exists { 
			c.JSON(http.StatusNotFound, gin.H{"error": "Recipe doesn't exist"}) 
			return 
		} 
		if err := service.DeleteRecipe(id); err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete recipe"}) 
			return 
		} 
		c.JSON(http.StatusOK, nil) 
	}) 
	
	// GET /recipes/ingredients?q=<term> 
	rg.GET("/ingredients", func(c *gin.Context) { 
		recipeId, err := strconv.Atoi(c.Query("q")) 
		if err != nil { 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Recipe"}) 
			return 
		} 
		exists, err := service.VerifyRecipeExists(recipeId) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if recipe exists"}) 
			return 
		}
		if !exists { 
			c.JSON(http.StatusNotFound, gin.H{"error": "Recipe doesn't exist"}) 
			return 
		} 
		recipeIngredients, err := service.GetRecipeIngredients(recipeId) 
		if err != nil { 
			log.Println(err) 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get recipe ingredients"}) 
			return 
		} 
		c.JSON(http.StatusOK, recipeIngredients) 
	}) 
	
	// POST /recipes/ingredients 
	rg.POST("/ingredients", func(c *gin.Context) { 
		var input RecipeIngredient 
		if err := c.ShouldBindJSON(&input); err != nil { 
			log.Println(err) 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"}) 
			return 
		}
		exists, err := service.VerifyRecipeExists(input.RecipeID) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if recipe exists"}) 
			return 
		} 
		if !exists { 
			c.JSON(http.StatusNotFound, gin.H{"error": "Recipe doesn't exist"}) 
			return 
		} 
		exists, err = ingredientService.VerifyIngredientExists(input.IngredientID) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if ingredient exists"}) 
			return 
		} 
		if !exists { 
			c.JSON(http.StatusNotFound, gin.H{"error": "Ingredient doesn't exist"}) 
			return 
		} 
		err = service.AddRecipeIngredient(input) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save recipe ingredient"}) 
			return 
		} 
		c.JSON(http.StatusCreated, nil) 
	}) 
	
	// DELETE /recipes/ingredients/:recipeId/:ingredientId 
	rg.DELETE("/ingredients/:recipeId/:ingredientId", func(c *gin.Context) { 
		recipeId, err := strconv.Atoi(c.Param("recipeId")) 
		if err != nil { 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Recipe ID"}) 
			return 
		} 
		ingredientId, err := strconv.Atoi(c.Param("ingredientId")) 
		if err != nil { 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Ingredient ID"}) 
			return 
		} 
		exists, err := service.VerifyRecipeExists(recipeId) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if recipe exists"}) 
			return 
		} 
		if !exists { 
			c.JSON(http.StatusNotFound, gin.H{"error": "Recipe doesn't exist"}) 
			return 
		} 
		exists, err = ingredientService.VerifyIngredientExists(ingredientId) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if ingredient exists"}) 
			return 
		} 
		if !exists { 
			c.JSON(http.StatusNotFound, gin.H{"error": "Ingredient doesn't exist"}) 
			return 
		} 
		if err := service.DeleteRecipeIngredient(recipeId, ingredientId); err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete recipe ingredient"}) 
			return 
		} 
		c.JSON(http.StatusOK, nil) 
	}) 
	
	// PUT /recipes/ingredients 
	rg.PUT("/ingredients", func(c *gin.Context) { 
		var input RecipeIngredient 
		if err := c.ShouldBindJSON(&input); 
		err != nil { 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"}) 
			return 
		} 
		exists, err := service.VerifyRecipeExists(input.RecipeID) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if recipe exists"}) 
			return 
		} 
		if !exists { 
			c.JSON(http.StatusNotFound, gin.H{"error": "Recipe doesn't exist"}) 
			return 
		}
		exists, err = ingredientService.VerifyIngredientExists(input.IngredientID) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if ingredient exists"}) 
			return 
		} 
		if !exists { 
			c.JSON(http.StatusNotFound, gin.H{"error": "Ingredient doesn't exist"}) 
			return 
		} 
		if err := service.EditRecipeIngredient(input); err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to edit recipe ingredient"}) 
			return 
		} 
		c.JSON(http.StatusOK, nil) 
	}) 
	
	// POST /recipes/:id/image 
	rg.POST("/:id/image", func(c *gin.Context) { 
		id, err := strconv.Atoi(c.Param("id")) 
		if err != nil { 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Recipe ID"}) 
			return 
		} 
		exists, err := service.VerifyRecipeExists(id) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if recipe exists"}) 
			return 
		} 
		if !exists { 
			c.JSON(http.StatusNotFound, gin.H{"error": "Recipe doesn't exist"}) 
			return 
		} 
		file, err := c.FormFile("image") 
		if err != nil { 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Image is required for upload"}) 
			return 
		} 
		if !strings.HasPrefix(file.Header.Get("Content-Type"), "image/") { 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type"}) 
			return 
		} 

		recipe, err := service.GetRecipe(id) 
		if err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get recipe"}) 
			return 
		}
		if recipe.ImageUrl != "" {
			oldPath := filepath.Join(ImageDir, recipe.ImageUrl)
			if err := os.Remove(oldPath); err != nil && !os.IsNotExist(err) {
				log.Printf("Failed to delete old image: %v", err)
			}
		}

		ext := filepath.Ext(file.Filename)
		newFileName := fmt.Sprintf("recipe_%d_%s", id, ext)
		savePath := filepath.Join(ImageDir, newFileName)

		if err := c.SaveUploadedFile(file, savePath); err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save recipe image"}) 
			return 
		} 

		if err := service.UpdateRecipeImage(id, newFileName); err != nil { 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update recipe image"}) 
			return 
		} 

		c.JSON(http.StatusOK, gin.H{"imageUrl": newFileName}) 
	}) 
}