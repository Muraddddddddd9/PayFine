package user

import (
	"database/sql"
	"payfine/api/handlers/jwt"

	"github.com/gofiber/fiber/v2"
)

type Users struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	Surname      string `json:"surname"`
	Patronymic   string `json:"patronymic"`
	Email        string `json:"email"`
	Number_Car   string `json:"number_car"`
	Number_Fines string `json:"number_fines"`
	Spent_Fines  string `json:"spent_fines"`
	Status       string `json:"status"`
}

func GetUser(c *fiber.Ctx, database *sql.DB) error {
	var userData Users
	session_key := c.Params("session_key")

	userId, err := jwt.CheckJWT(session_key)

	if err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	query := `SELECT id, name, surname, patronymic, email, number_car, number_fines, spent_fines, status FROM users WHERE id = $1`
	err = database.QueryRow(query, userId).Scan(
		&userData.ID,
		&userData.Name,
		&userData.Surname,
		&userData.Patronymic,
		&userData.Email,
		&userData.Number_Car,
		&userData.Number_Fines,
		&userData.Spent_Fines,
		&userData.Status,
	)

	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Get data user is failed",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"dataUser": userData,
	})
}
