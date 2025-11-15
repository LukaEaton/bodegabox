package recipes

import (
	"log"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"bodegabox-rest/internal/ingredients"
)

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

	rg.POST("/addIngredient", func(c *gin.Context) {
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
}