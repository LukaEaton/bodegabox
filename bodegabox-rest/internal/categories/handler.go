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
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch categories"})
			return
		}
		c.JSON(http.StatusOK, categories)
	})

	rg.GET("/search", func(c *gin.Context) {
		query := c.Query("q")
		if query == "" {
			log.Println("Search query is missing")
			c.JSON(http.StatusBadRequest, gin.H{"error": "missing search query"})
			return
		}
		results, err := service.SearchCategories(query)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to search categories"})
			return
		}
		c.JSON(http.StatusOK, results)
	})

	rg.PUT("/", func(c *gin.Context) {
		var input Category
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
			return
		}
		exists, err := service.VerifyCategoryExists(input.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify category"})
			return
		}
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "category not found"})
			return
		}
		updatedCategory, err := service.UpdateCategory(input.ID, input.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update category"})
			return
		}
		c.JSON(http.StatusOK, updatedCategory)
	})

	rg.POST("/", func(c *gin.Context) {
		var input struct {
			Name string `json:"name" binding:"required"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
			return
		}
		exists, err := service.VerifyCategoryExistsByName(input.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify category"})
			return
		}
		if exists {
			c.JSON(http.StatusConflict, gin.H{"error": "category with this name already exists"})
			return
		}
		category, err := service.CreateCategory(input.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create category"})
			return
		}
		c.JSON(http.StatusOK, category)
	})

	rg.DELETE("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid store ID"})
			return
		}
		exists, err := service.VerifyCategoryExists(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify category"})
			return
		}
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "category not found"})
			return
		}
		if err := service.DeleteCategory(id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete category"})
			return
		}
		c.Status(http.StatusNoContent)
	})
}