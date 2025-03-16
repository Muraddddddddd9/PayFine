package car

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func GetAllCar(c *fiber.Ctx, database *sql.DB) error {
	query := `SELECT number FROM cars`
	rows, err := database.Query(query)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Get all cars failed",
		})
	}
	defer rows.Close()

	var allCar []string

	for rows.Next() {
		var number string
		if err := rows.Scan(&number); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Error scanning rows",
			})
		}
		allCar = append(allCar, number)
	}

	if err = rows.Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error iterating rows",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"allCar": allCar,
	})
}
