package grpc

import (
	"context"
	pb "payfine/service"

	"github.com/gofiber/fiber/v2"
)

func BalanceOfGRPC(c *fiber.Ctx, client pb.ContractServiceClient) error {
	id := c.Params("id")
	status := c.Params("status")

	resp, err := client.BalanceOf(context.Background(), &pb.BalanceRequest{Id: id, Status: status})
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "User not found",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"balance": resp,
	})
}
