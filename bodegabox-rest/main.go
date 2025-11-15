package main

import (
	"bodegabox-rest/internal/categories"
	"bodegabox-rest/internal/ingredients"
	"bodegabox-rest/internal/recipes"
	"bodegabox-rest/internal/stores"
	"bodegabox-rest/middleware"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func setupTrustedProxies(router *gin.Engine) {
	trustedProxiesEnv := os.Getenv("TRUSTED_PROXIES")
	var trustedProxies []string

	if trustedProxiesEnv != "" {
		trustedProxies = strings.Split(trustedProxiesEnv, ",")
		log.Printf("Using trusted proxies from env: %v", trustedProxies)
	} else {
		trustedProxies = []string{"127.0.0.1", "172.17.0.0/16"}
		log.Printf("Using default trusted proxies: %v", trustedProxies)
	}

	if err := router.SetTrustedProxies(trustedProxies); err != nil {
		log.Fatalf("Failed to set trusted proxies: %v", err)
	}
}

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

	r := gin.New()
	r.Use(gin.Logger())
    r.Use(gin.Recovery()) 
	setupTrustedProxies(r)
	r.Use(middleware.CORSMiddleware())

	ingredientService := ingredients.NewService(db)
	ingredients.RegisterRoutes(r.Group("/ingredients"), ingredientService)
	categoryService := categories.NewService(db)
	categories.RegisterRoutes(r.Group("/categories"), categoryService)
	storeService := stores.NewService(db)
	stores.RegisterRoutes(r.Group("/stores"), storeService)
	recipeService := recipes.NewService(db)
	recipes.RegisterRoutes(r.Group("/recipes"), recipeService, ingredientService)

	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Starting server on port %s...", port)
	log.Fatal(r.Run(":" + port))
}