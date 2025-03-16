package car

import (
	"database/sql"
	"log"
	"payfine/api/handlers/jwt"

	"github.com/gofiber/fiber/v2"
)

func DeleteCar(c *fiber.Ctx, database *sql.DB) error {
	number := c.Params("number")
	session_key := c.Params("session_key")
	idUser, _ := jwt.CheckJWT(session_key)

	var numberInUserDB string
	var numberInCarDB string

	queryCheckUserCar := `SELECT number_car FROM users WHERE id = $1`
	errUserCar := database.QueryRow(queryCheckUserCar, idUser).Scan(&numberInUserDB)

	if errUserCar != nil || numberInUserDB == "none" {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "The user does not have a car",
		})
	}

	queryCheckCar := `SELECT number FROM cars WHERE number = $1`
	errCar := database.QueryRow(queryCheckCar, number).Scan(&numberInCarDB)

	if errCar != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "The car was not found",
		})
	}

	if numberInUserDB != numberInCarDB {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "The user's machine is not equal to the machine being modified",
		})
	}

	queryDeleteCarForUser := `UPDATE users SET number_car = 'none' WHERE id = $1`
	_, errDel := database.Exec(queryDeleteCarForUser, idUser)

	if errDel != nil {
		return c.Status(fiber.StatusNotAcceptable).JSON(fiber.Map{
			"message": "Deleting a user's car failed",
		})
	}

	queryDeleteCar := `DELETE FROM cars WHERE number = $1`
	_, errDel = database.Exec(queryDeleteCar, number)

	if errDel != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Deleting a car failed",
		})
	}

	log.Printf("Data car with number '%s' has been deleting\n", number)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Data car has been deleting",
	})
}
