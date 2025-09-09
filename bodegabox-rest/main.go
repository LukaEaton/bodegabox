package main

import (
	"log"
	"bodegabox-rest/internal/ingredients"
	"github.com/gin-gonic/gin"
)

func main() {
	// Create Gin router
	r := gin.Default()

	// Wire up service and handler
	service := ingredients.NewService()
	ingredients.RegisterRoutes(r.Group("/ingredients"), service)

	// Start server
	log.Fatal(r.Run(":8080"))
}
