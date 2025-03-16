package grpc

import (
	"context"
	pb "payfine/service"

	"github.com/gofiber/fiber/v2"
)

type Mint struct {
	Minter string `json:"minter"`
	Amount string `json:"amount"`
	Status string `json:"status"`
}

func MintGRPC(c *fiber.Ctx, client pb.ContractServiceClient, minter, amount, status string) error {
	mintData := Mint{
		Minter: minter,
		Amount: amount,
		Status: status,
	}

	if err := c.BodyParser(&mintData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	resp, err := client.Mint(context.Background(), &pb.MintRequest{Minter: mintData.Minter, Amount: mintData.Amount, Status: mintData.Status})

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Failed mint token for user",
			"result":  resp,
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Mint token is succ",
		"result":  resp,
	})
}
