package user

import (
	"database/sql"
	"payfine/api/handlers/jwt"

	"github.com/gofiber/fiber/v2"
)

type LoginStruct struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx, database *sql.DB) error {
	var dataLogin LoginStruct
	var dataUserID int

	if err := c.BodyParser(&dataLogin); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
			"error":   err.Error(),
		})
	}

	querySelect := "SELECT id FROM users WHERE email = $1 AND password = $2"
	err := database.QueryRow(querySelect, dataLogin.Email, dataLogin.Password).Scan(&dataUserID)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "User is not found",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Login is succseffully",
		"token":   jwt.CreateJWT(dataUserID),
	})
}
