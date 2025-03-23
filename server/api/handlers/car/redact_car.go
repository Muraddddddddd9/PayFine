package car

import (
	"database/sql"
	"fmt"
	"log"
	"payfine/api/handlers/jwt"

	"github.com/gofiber/fiber/v2"
)

type NewDataCarStruct struct {
	LabelData string `json:"label_data"`
	NewData   any    `json:"new_data"`
}

func RedactCar(c *fiber.Ctx, database *sql.DB) error {
	var newData NewDataCarStruct
	session_key := c.Params("session_key")
	idUser, _ := jwt.CheckJWT(session_key)
	var Number string

	if err := c.BodyParser(&newData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	if newData.LabelData == "number" {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "The car number cannot be updated",
		})
	}

	queryCheckUserCar := `SELECT number_car FROM users WHERE id = $1`
	errCheckUser := database.QueryRow(queryCheckUserCar, idUser).Scan(&Number)

	if errCheckUser != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "The user does not have a car",
		})
	}

	queryCheckCar := `SELECT * FROM cars WHERE number = $1`
	_, errCheckCar := database.Exec(queryCheckCar, Number)

	if errCheckCar != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "The car was not found",
		})
	}

	queryUpdateCar := fmt.Sprintf(`UPDATE cars SET %s = $1 WHERE number = $2`, newData.LabelData)
	_, errDel := database.Exec(queryUpdateCar, newData.NewData, Number)

	if errDel != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Update data a car failed",
		})
	}

	log.Printf("The user with ID '%d' had the '%s' field of the car with the number '%s' edited to '%v'\n", idUser, newData.LabelData, Number, newData.NewData)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Data car has been update",
	})
}
