package car

import (
	"database/sql"
	"payfine/api/handlers/jwt"

	"github.com/gofiber/fiber/v2"
)

func GetCar(c *fiber.Ctx, database *sql.DB) error {
	session_key := c.Params("session_key")
	userId, err := jwt.CheckJWT(session_key)

	if err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": err.Error(),
		})
	}
	
	var userCar Cars
	var userNumber string

	queyGetNumberCar := `SELECT number_car FROM users WHERE id = $1`
	_ = database.QueryRow(queyGetNumberCar, userId).Scan(&userNumber)

	query := `SELECT number, validity_period, category, price, service_life FROM cars WHERE number = $1`
	err = database.QueryRow(query, userNumber).Scan(
		&userCar.Number,
		&userCar.ValidityPeriod,
		&userCar.Category,
		&userCar.Price,
		&userCar.ServiceLife,
	)

	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Get data car is failed",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"dataCar": userCar,
	})
}
