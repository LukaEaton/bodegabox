package stores

import (
	"net/http"
	"github.com/gin-gonic/gin"
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
}