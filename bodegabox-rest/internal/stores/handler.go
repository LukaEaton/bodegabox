package stores

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"log"
)

func RegisterRoutes(rg *gin.RouterGroup, service *Service) {
	rg.GET("/", func(c *gin.Context) {
		stores, err := service.GetAll()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch stores"})
			return
		}
		c.JSON(http.StatusOK, stores)
	})

	rg.GET("/search", func(c *gin.Context) {
		query := c.Query("q")
		if query == "" {
			log.Println("Search query is missing")
			c.JSON(http.StatusBadRequest, gin.H{"error": "missing search query"})
			return
		}
		results, err := service.SearchStores(query)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to search stores"})
			return
		}
		c.JSON(http.StatusOK, results)
	})
}