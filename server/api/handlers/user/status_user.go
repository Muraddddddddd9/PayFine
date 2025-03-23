package user

import (
	"database/sql"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type StatusPayStruct struct {
	Car    string `json:"car"`
	Amount int    `json:"amount"`
}

func PushStatusNumberOfFines(c *fiber.Ctx, database *sql.DB) error {
	var car string
	car = c.Params("car")
	car = strings.TrimSpace(car)

	if car == "" || len(car) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	query := `UPDATE users SET number_fines = number_fines + 1 WHERE number_car = $1`
	_, err := database.Exec(query, car)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "The addition was not successful",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "The addition was successful",
	})
}

func PushStatusPay(c *fiber.Ctx, database *sql.DB) error {
	var dataCar StatusPayStruct

	if err := c.BodyParser(&dataCar); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	query := `UPDATE users SET spent_fines = spent_fines + $1 WHERE number_car = $2`
	_, err := database.Exec(query, dataCar.Amount, dataCar.Car)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "The addition was not successful",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "The addition was successful",
	})
}
