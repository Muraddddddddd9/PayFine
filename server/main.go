package main

import (
	"fmt"
	"payfine/api"
	"payfine/api/handlers/car"
	"payfine/api/handlers/grpc"
	"payfine/api/handlers/user"
	"payfine/config"
	pb "payfine/service"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/lib/pq"
)

func main() {
	cfg := config.LoadConfig()

	database := api.ConnectDB(cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBName, cfg.DBSsl, cfg.DBPath, cfg.DBPort)
	defer database.Close()

	databaseGRPC := grpc.ConnectGRPC()
	defer databaseGRPC.Close()
	client := pb.NewContractServiceClient(databaseGRPC)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	app.Post("/login", func(c *fiber.Ctx) error {
		return user.Login(c, database)
	})

	app.Put("/createEmailConfirmation", func(c *fiber.Ctx) error {
		return user.CreateEmailConfirmation(c, database)
	})

	app.Put("/createUser", func(c *fiber.Ctx) error {
		return user.EmailConfirmation(c, database)
	})

	app.Put("/redactUser/:session_key", func(c *fiber.Ctx) error {
		return user.RedactUser(c, database)
	})

	app.Get("/getUser/:session_key", func(c *fiber.Ctx) error {
		return user.GetUser(c, database)
	})

	app.Put("/pushStatusNumberOfFines/:car", func(c *fiber.Ctx) error {
		return user.PushStatusNumberOfFines(c, database)
	})

	app.Put("/pushStatusPay", func(c *fiber.Ctx) error {
		return user.PushStatusPay(c, database)
	})

	app.Put("/createCar/:session_key", func(c *fiber.Ctx) error {
		return car.CreateCar(c, database)
	})

	app.Delete("/deleteCar/:number/:session_key", func(c *fiber.Ctx) error {
		return car.DeleteCar(c, database)
	})

	app.Get("/getAllCar", func(c *fiber.Ctx) error {
		return car.GetAllCar(c, database)
	})

	app.Get("/getCar/:session_key", func(c *fiber.Ctx) error {
		return car.GetCar(c, database)
	})

	app.Put("/redactCar/:session_key", func(c *fiber.Ctx) error {
		return car.RedactCar(c, database)
	})

	app.Get("/getFine/:car/:status", func(c *fiber.Ctx) error {
		return grpc.ReadGRPC(c, client, database)
	})

	app.Get("/balanceOf/:id/:status", func(c *fiber.Ctx) error {
		return grpc.BalanceOfGRPC(c, client)
	})

	app.Put("/transfer", func(c *fiber.Ctx) error {
		return grpc.TransferGRPC(c, client, database)
	})

	app.Put("/sendFine", func(c *fiber.Ctx) error {
		return grpc.SendFineGRPC(c, client)
	})

	go func() {
		for {
			api.ClearEmail(database)
			time.Sleep(24 * time.Hour)
		}
	}()

	go func() {
		for {
			time.Sleep(720 * time.Hour)
			grpc.MintTokenAllUser(client, database)
		}
	}()

	app.Listen(fmt.Sprintf("localhost:%v", cfg.ServerPort))
}
