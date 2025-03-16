package user

import (
	"database/sql"
	"fmt"
	"log"

	"payfine/api/handlers/jwt"

	"github.com/gofiber/fiber/v2"
)

type NewDataUserStruct struct {
	LabelData string `json:"label_data"`
	NewData   any    `json:"new_data"`
}

func RedactUser(c *fiber.Ctx, database *sql.DB) error {
	session_key := c.Params("session_key")
	idUser, err := jwt.CheckJWT(session_key)

	if err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "Session key is not valid",
		})
	}

	var newUserData NewDataUserStruct

	if err := c.BodyParser(&newUserData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	if newUserData.LabelData == "email" {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "The email cannot be edited",
		})
	}

	queryUpdate := fmt.Sprintf(`UPDATE users SET %s = $1 WHERE id = $2`, newUserData.LabelData)
	_, err = database.Exec(queryUpdate, newUserData.NewData, idUser)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "The user has not updated the data",
		})
	}

	log.Printf("The user with ID '%d' has edited the '%s' to '%s' \n", idUser, newUserData.LabelData, newUserData.NewData)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Data user has been update",
	})
}
