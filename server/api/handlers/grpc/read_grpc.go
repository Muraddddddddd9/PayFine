package grpc

import (
	"context"
	"database/sql"
	"fmt"

	pb "payfine/service"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

type Fine struct {
	IdFine  int64  `json:"id_fine"`
	Car     string `json:"car"`
	Price   int64  `json:"price"`
	Reason  string `json:"reason"`
	Date    int64  `json:"date"`
	DatePay int64  `json:"date_pay"`
}

func GetPayFine(c *fiber.Ctx, db *sql.DB, car string) ([]Fine, error) {
	var userFines []Fine

	query := "SELECT * FROM fines WHERE car = $1"
	rows, err := db.Query(query, car)
	if err != nil {
		return nil, c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "User is not found",
		})
	}

	for rows.Next() {
		var fine Fine

		if err := rows.Scan(&fine.IdFine, &fine.Car, &fine.Price, &fine.Reason, &fine.Date, &fine.DatePay); err != nil {
			return nil, c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Error scaning rows",
			})
		}

		userFines = append(userFines, fine)
	}

	if err = rows.Err(); err != nil {
		return nil, c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error iterating rows",
		})
	}

	return userFines, nil
}

func ReadGRPC(c *fiber.Ctx, client pb.ContractServiceClient, db *sql.DB) error {
	car := c.Params("car")
	status := c.Params("status")

	resp, err := client.ReadData(context.Background(), &pb.ReadRequest{Car: car, Status: status})
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("Error read from grpc: %v", err),
		})
	}

	payFines, err := GetPayFine(c, db, car)
	if err != nil {
		log.Errorf("Error add fine: %v", err)
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message":  "Read data is succ",
		"data":     resp,
		"payFines": payFines,
	})
}
