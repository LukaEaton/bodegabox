package ingredients

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes adds ingredient routes to the router group.
func RegisterRoutes(rg *gin.RouterGroup, service *Service) {
	rg.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, service.GetAll())
	})

	rg.GET("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
			return
		}
		ing, err := service.GetByID(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusOK, ing)
	})

	rg.POST("/", func(c *gin.Context) {
		var input struct {
			Name       string `json:"name" binding:"required"`
			CategoryID int    `json:"categoryId" binding:"required"`
			StoreID    int    `json:"storeId" binding:"required"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		ing := service.Create(input.Name, input.CategoryID, input.StoreID)
		c.JSON(http.StatusCreated, ing)
	})
}