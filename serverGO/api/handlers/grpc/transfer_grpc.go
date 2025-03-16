package grpc

import (
	"context"
	pb "payfine/service"

	"github.com/gofiber/fiber/v2"
)

type Transfer struct {
	IdFine int64  `json:"idFine"`
	From   string `json:"from"`
	Status string `json:"status"`
}

func TransferGRPC(c *fiber.Ctx, client pb.ContractServiceClient) error {
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

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Transfer is succ",
		"result":  resp,
	})
}
