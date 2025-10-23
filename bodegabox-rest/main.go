package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"bodegabox-rest/middleware"
	"bodegabox-rest/internal/ingredients"
	"bodegabox-rest/internal/categories"
	"bodegabox-rest/internal/stores"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	// Database connection parameters from environment variables
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	if dbHost == "" || dbPort == "" || dbUser == "" || dbPass == "" || dbName == "" {
		log.Fatal("Database environment variables not set")
	}

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPass, dbName,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err = db.Ping(); err != nil {
		log.Fatalf("Database ping failed: %v", err)
	}

	log.Println("✅ Connected to PostgreSQL database successfully")

	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	ingredientService := ingredients.NewService(db)
	ingredients.RegisterRoutes(r.Group("/ingredients"), ingredientService)
	categoryService := categories.NewService(db)
	categories.RegisterRoutes(r.Group("/categories"), categoryService)
	storeService := stores.NewService(db)
	stores.RegisterRoutes(r.Group("/stores"), storeService)

	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Starting server on port %s...", port)
	log.Fatal(r.Run(":" + port))
}