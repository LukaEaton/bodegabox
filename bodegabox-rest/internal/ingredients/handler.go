package ingredients

import (
	"log"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
)

// RegisterRoutes adds ingredient routes to the router group.
func RegisterRoutes(rg *gin.RouterGroup, service *Service) {
	// GET /ingredients/
	rg.GET("/", func(c *gin.Context) {
		ingredients, err := service.GetAll()
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Ingredients"})
			return
		}
		c.JSON(http.StatusOK, ingredients)
	})

	// GET /ingredients/saved
	rg.GET("/saved", func(c *gin.Context) {
		savedIngredients, err := service.GetAllSaved()
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Saved Ingredients"})
			return
		}
		c.JSON(http.StatusOK, savedIngredients)
	})

	// GET /ingredients/:id
	rg.GET("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Ingredient ID"})
			return
		}
		ing, err := service.GetByID(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Failed to fetch Ingredient"})
			return
		}
		c.JSON(http.StatusOK, ing)
	})

	// Get /ingredients/search?q=<term>
	rg.GET("/search", func(c *gin.Context) {
		query := c.Query("q")
		if query == "" {
			log.Println("Search query is missing")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing search query"})
			return
		}
		results, err := service.SearchIngredients(query)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search Ingredients"})
			return
		}
		c.JSON(http.StatusOK, results)
	})

	// POST /ingredients/addToList
	rg.POST("/addToList", func(c *gin.Context) {
		var input PendingIngredient
		if err := c.ShouldBindJSON(&input); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		ingredientId, _ := input.IngredientID.Int64()
		count, err := service.VerifySavedIngredientExists(int(ingredientId), true)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if Ingredient is already on the Shopping List"})
			return
		}
		extraCount, err := service.VerifySavedIngredientExists(int(ingredientId), false)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if Ingredient is already on the Shopping List"})
			return
		}
		if (count || extraCount) {
			c.JSON(http.StatusConflict, gin.H{"error": "Ingredient already on the Shopping List"})
			return
		}
		err = service.AddToShoppingList(int(ingredientId), input.Description)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add Ingredient to Shopping List"})
			return
		}
		c.JSON(http.StatusCreated, nil)
	})

	// PUT /ingredients/editList
	rg.PUT("/editList", func(c *gin.Context) {
		var input PendingIngredient
		if err := c.ShouldBindJSON(&input); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		ingredientId, _ := input.IngredientID.Int64()
		count, err := service.VerifySavedIngredientExists(int(ingredientId), true)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if Ingredient is already on the Shopping List"})
			return
		}
		if (!count) {
			c.JSON(http.StatusConflict, gin.H{"error": "Ingredient isn't on the Shopping List"})
			return
		}
		err = service.EditShoppingList(int(ingredientId), input.Description)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add Ingredient to Shopping List"})
			return
		}
		c.JSON(http.StatusOK, nil)
	})

	// PUT /ingredients/purchase
	rg.PUT("/purchase", func(c *gin.Context) {
		var input int
		if err := c.ShouldBindJSON(&input); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		count, err := service.VerifySavedIngredientExists(input, true)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if Ingredient is already on the Shopping List"})
			return
		}
		if (!count) {
			c.JSON(http.StatusConflict, gin.H{"error": "Ingredient isn't on the Shopping List"})
			return
		}
		err = service.InvalidateIngredient(input)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to purchase Ingredient"})
			return
		}
		c.JSON(http.StatusOK, nil)
	})

	// PUT /ingredients/revertPurchase
	rg.PUT("/revertPurchase", func(c *gin.Context) {
		var input int
		if err := c.ShouldBindJSON(&input); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		count, err := service.VerifySavedIngredientExists(input, false)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if Ingredient is already on the Shopping List"})
			return
		}
		if (!count) {
			c.JSON(http.StatusConflict, gin.H{"error": "Ingredient was never purchased"})
			return
		}
		err = service.ReValidateIngredient(input)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to revert purchase"})
			return
		}
		c.JSON(http.StatusOK, nil)
	})

	// PUT /ingredients/updateDetails
	rg.PUT("/updateDetails", func(c *gin.Context) {
		var input Ingredient
		if err := c.ShouldBindJSON(&input); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		err := service.UpdateIngredientDetails(input)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Ingredient details"})
			return
		}
		c.JSON(http.StatusOK, nil)
	})

	// POST /ingredients/
	rg.POST("/", func(c *gin.Context) {
		var input struct {
			Name       string `json:"name" binding:"required"`
			CategoryID int    `json:"categoryId" binding:"required"`
			StoreID    int    `json:"storeId" binding:"required"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		exists, err := service.VerifyIngredientExistsByName(input.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if Ingredient exists"})
			return
		}
		if exists {
			c.JSON(http.StatusConflict, gin.H{"error": "This Ingredient already exists"})
			return
		}
		ing, err := service.CreateIngredient(input.Name, input.CategoryID, input.StoreID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Ingredient"})
			return
		}
		c.JSON(http.StatusCreated, ing)
	})

	rg.DELETE("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Ingredient ID"})
			return
		}
		exists, err := service.VerifyIngredientExists(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if Ingredient already exists"})
			return
		}
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "Ingredient doesn't exist"})
			return
		}
		if err := service.DeleteIngredient(id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Ingredient"})
			return
		}
		c.JSON(http.StatusOK, nil)
	})
}
