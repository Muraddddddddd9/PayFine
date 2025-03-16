package grpc

import (
	"context"
	"fmt"

	pb "payfine/service"

	"github.com/gofiber/fiber/v2"
)

func ReadGRPC(c *fiber.Ctx, client pb.ContractServiceClient) error {
	car := c.Params("car")
	status := c.Params("status")

	resp, err := client.ReadData(context.Background(), &pb.ReadRequest{Car: car, Status: status})
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("Error read from grpc: %v", err),
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Read data is succ",
		"data":    resp,
	})
}
