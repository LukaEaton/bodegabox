package stores

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"log"
	"strconv"
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

	rg.PUT("/", func(c *gin.Context) {
		var input Store
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
			return
		}
		exists, err := service.VerifyStoreExists(input.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify store"})
			return
		}
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "store not found"})
			return
		}
		updatedStore, err := service.UpdateStore(input.ID, input.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update store"})
			return
		}
		c.JSON(http.StatusOK, updatedStore)
	})

	rg.POST("/", func(c *gin.Context) {
		var input struct {
			Name string `json:"name" binding:"required"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
			return
		}
		exists, err := service.VerifyStoreExistsByName(input.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify store"})
			return
		}
		if exists {
			c.JSON(http.StatusConflict, gin.H{"error": "store with this name already exists"})
			return
		}
		store, err := service.CreateStore(input.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create store"})
			return
		}
		c.JSON(http.StatusOK, store)
	})

	rg.DELETE("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid store ID"})
			return
		}
		exists, err := service.VerifyStoreExists(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify store"})
			return
		}
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "store not found"})
			return
		}
		if err := service.DeleteStore(id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete store"})
			return
		}
		c.Status(http.StatusNoContent)
	})
}