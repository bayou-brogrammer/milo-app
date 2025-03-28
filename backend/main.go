package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Event struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Location    string    `json:"location"`
	CalendarID  string    `json:"calendarId"`
}

type Calendar struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Color  string `json:"color"`
	Source string `json:"source"`
}

type EnergyLevel struct {
	ID          string    `json:"id"`
	Level       string    `json:"level"`
	Description string    `json:"description"`
	Timestamp   time.Time `json:"timestamp"`
	UserID      string    `json:"userId"`
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found: %v", err)
	}

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	// Calendar endpoints
	r.GET("/api/calendars", getCalendars)
	r.GET("/api/events", getEvents)
	r.POST("/api/events", createEvent)
	r.PUT("/api/events/:id", updateEvent)
	r.DELETE("/api/events/:id", deleteEvent)

	// Energy tracking endpoints
	r.GET("/api/energy", getEnergyLevels)
	r.POST("/api/energy", recordEnergyLevel)
	r.GET("/api/energy/recommendations", getRecommendations)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}

func getCalendars(c *gin.Context) {
	// Mock data for demonstration
	calendars := []Calendar{
		{
			ID:     "1",
			Title:  "Personal",
			Color:  "#4CAF50",
			Source: "Local",
		},
		{
			ID:     "2",
			Title:  "Work",
			Color:  "#2196F3",
			Source: "Local",
		},
	}

	c.JSON(http.StatusOK, calendars)
}

func getEvents(c *gin.Context) {
	// Mock data for demonstration
	events := []Event{
		{
			ID:          "1",
			Title:       "Team Meeting",
			Description: "Weekly sync",
			StartDate:   time.Now().Add(time.Hour * 2),
			EndDate:     time.Now().Add(time.Hour * 3),
			Location:    "Conference Room",
			CalendarID:  "1",
		},
	}

	c.JSON(http.StatusOK, events)
}

func createEvent(c *gin.Context) {
	var event Event
	if err := c.BindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mock creation - in real app, save to database
	event.ID = "new-event-id"
	
	c.JSON(http.StatusCreated, event)
}

func updateEvent(c *gin.Context) {
	id := c.Param("id")
	var event Event
	if err := c.BindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event.ID = id
	c.JSON(http.StatusOK, event)
}

func deleteEvent(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func getEnergyLevels(c *gin.Context) {
	// Mock data for demonstration
	energyLevels := []EnergyLevel{
		{
			ID:          "1",
			Level:       "High",
			Description: "Feeling productive",
			Timestamp:   time.Now().Add(-time.Hour * 2),
			UserID:      "user1",
		},
	}

	c.JSON(http.StatusOK, energyLevels)
}

func recordEnergyLevel(c *gin.Context) {
	var energyLevel EnergyLevel
	if err := c.BindJSON(&energyLevel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mock creation - in real app, save to database
	energyLevel.ID = "new-energy-id"
	energyLevel.Timestamp = time.Now()
	
	c.JSON(http.StatusCreated, energyLevel)
}

func getRecommendations(c *gin.Context) {
	recommendations := []map[string]string{
		{
			"title": "Take a Break",
			"description": "Your energy levels typically dip around this time. Consider a 15-minute walk.",
		},
	}

	c.JSON(http.StatusOK, recommendations)
}