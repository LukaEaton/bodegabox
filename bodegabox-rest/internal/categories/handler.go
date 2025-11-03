package categories

import (
	"log"
	"net/http"

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
}