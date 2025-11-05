package categories

import (
	"log"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
)

// RegisterRoutes adds categories routes to the router group.
func RegisterRoutes(rg *gin.RouterGroup, service *Service) {
	rg.GET("/", func(c *gin.Context) {
		categories, err := service.GetAll()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Categories"})
			return
		}
		c.JSON(http.StatusOK, categories)
	})

	rg.GET("/search", func(c *gin.Context) {
		query := c.Query("q")
		if query == "" {
			log.Println("Search query is missing")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing search query"})
			return
		}
		results, err := service.SearchCategories(query)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search Categories"})
			return
		}
		c.JSON(http.StatusOK, results)
	})

	rg.PUT("/", func(c *gin.Context) {
		var input Category
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		exists, err := service.VerifyCategoryExists(input.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if Category exists"})
			return
		}
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "Category doesn't exist"})
			return
		}
		updatedCategory, err := service.UpdateCategory(input.ID, input.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Category"})
			return
		}
		c.JSON(http.StatusOK, updatedCategory)
	})

	rg.POST("/", func(c *gin.Context) {
		var input struct {
			Name string `json:"name" binding:"required"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		exists, err := service.VerifyCategoryExistsByName(input.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if Category exists"})
			return
		}
		if exists {
			c.JSON(http.StatusConflict, gin.H{"error": "This Category already exists"})
			return
		}
		category, err := service.CreateCategory(input.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Category"})
			return
		}
		c.JSON(http.StatusOK, category)
	})

	rg.DELETE("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Category ID"})
			return
		}
		exists, err := service.VerifyCategoryExists(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify if Category exists"})
			return
		}
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "Category doesn't exist"})
			return
		}
		if err := service.DeleteCategory(id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Category"})
			return
		}
		c.JSON(http.StatusOK, nil)
	})
}