package categories

import (
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
}