package grpc

import (
	"context"
	pb "payfine/service"

	"github.com/gofiber/fiber/v2"
)

type SendFine struct {
	Car    string `json:"car"`
	Price  int32  `json:"price"`
	Reason string `json:"reason"`
	Date   string `json:"date"`
	Status string `json:"status"`
}

func SendFineGRPC(c *fiber.Ctx, client pb.ContractServiceClient) error {
	var sendFineData SendFine
	if err := c.BodyParser(&sendFineData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	resp, err := client.SendFine(context.Background(), &pb.FineRequest{Car: sendFineData.Car, Price: sendFineData.Price, Reason: sendFineData.Reason, Date: sendFineData.Date, Status: sendFineData.Status})
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Send fine is failed",
			"send":    resp,
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Send fine is succ",
		"send":    resp,
	})
}
