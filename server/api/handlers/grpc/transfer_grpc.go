package grpc

import (
	"context"
	"database/sql"
	"fmt"
	pb "payfine/service"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

type Transfer struct {
	From   string `json:"from"`
	Status string `json:"status"`
	Fine
}

func SendPayFine(c *fiber.Ctx, db *sql.DB, payFineData *Transfer) error {
	if err := c.BodyParser(&payFineData); err != nil {
		return fmt.Errorf("invalid input: %v", err)
	}

	query := `INSERT INTO fines (id_fine, car, price, reason, date, date_pay) VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := db.Exec(query, payFineData.Fine.IdFine, payFineData.Fine.Car, payFineData.Fine.Price, payFineData.Fine.Reason, payFineData.Fine.Date, payFineData.Fine.DatePay)
	if err != nil {
		return fmt.Errorf("invalid input: %v", err)
	}

	return nil
}

func TransferGRPC(c *fiber.Ctx, client pb.ContractServiceClient, db *sql.DB) error {
	var transferData Transfer

	if err := c.BodyParser(&transferData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	resp, err := client.Transfer(context.Background(), &pb.TransferRequst{IdFine: transferData.IdFine, From: transferData.From, Status: transferData.Status})
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Transfer is failed",
			"result":  resp,
		})
	}

	err = SendPayFine(c, db, &transferData)
	if err != nil {
		log.Errorf("Insert pay fine: %v", err)
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Transfer is succ",
		"result":  resp,
	})
}
