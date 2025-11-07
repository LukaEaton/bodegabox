package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
)

func CORSMiddleware() gin.HandlerFunc {
	env := os.Getenv("ENV")
	return func(c *gin.Context) {
		if env == "development" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

			if c.Request.Method == http.MethodOptions {
				c.AbortWithStatus(http.StatusNoContent)
				return
			}
		}

		c.Next()
	}
}
