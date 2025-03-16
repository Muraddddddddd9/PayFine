package car

import (
	"database/sql"
	"log"
	"payfine/api/handlers/jwt"

	"github.com/gofiber/fiber/v2"
)

type Cars struct {
	Number         string `json:"number"`
	ValidityPeriod int    `json:"validity_period"`
	Category       string `json:"category"`
	Price          int    `json:"price"`
	ServiceLife    int    `json:"service_life"`
}

func CreateCar(c *fiber.Ctx, database *sql.DB) error {
	var dataCar Cars
	session_key := c.Params("session_key")
	userId, _ := jwt.CheckJWT(session_key)

	if err := c.BodyParser(&dataCar); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	queryGetCar := "SELECT * FROM cars WHERE number = $1"
	rows, err := database.Query(queryGetCar, dataCar.Number)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to check car registration",
		})
	}
	defer rows.Close()

	if rows.Next() {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "The car is already registered",
		})
	}

	queryGetUserCar := "SELECT number_car FROM users WHERE id = $1"
	rows, err = database.Query(queryGetUserCar, userId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to check user's car",
		})
	}
	defer rows.Close()

	var numberCar string
	if rows.Next() {
		err = rows.Scan(&numberCar)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to parse user's car data",
			})
		}

		if numberCar != "none" {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"message": "User already has a car",
			})
		}
	}

	queryAddCarForUser := "UPDATE users SET number_car = $1 WHERE id = $2"
	result, err := database.Exec(queryAddCarForUser, dataCar.Number, userId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update user car",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotAcceptable).JSON(fiber.Map{
			"message": "Data is not updated",
		})
	}

	queryInsertCar := "INSERT INTO cars (number, validity_period, category, price, service_life) VALUES ($1, $2, $3, $4, $5)"
	_, err = database.Exec(queryInsertCar, dataCar.Number, dataCar.ValidityPeriod, dataCar.Category, dataCar.Price, dataCar.ServiceLife)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to add car data",
		})
	}

	log.Printf("A car with a '%s' number has been added for a user with an ID: %d\n", dataCar.Number, userId)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "The car data has been added",
	})
}
