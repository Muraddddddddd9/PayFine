package grpc

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	pb "payfine/service"
)

type Mint struct {
	Minter string `json:"minter"`
	Amount string `json:"amount"`
	Status string `json:"status"`
}

func MintTokenAllUser(client pb.ContractServiceClient, db *sql.DB) {
	log.Print("Token minting has begun for all users")
	query := `SELECT id FROM users`

	rows, err := db.Query(query)
	if err != nil {
		log.Fatal("Couldn't get all users")
		return
	}

	for rows.Next() {
		var minter string

		if err := rows.Scan(&minter); err != nil {
			log.Fatal("Error scaning rows")
			return
		}

		MintGRPC(client, minter, "50", "bank")
	}

	log.Print("Adding tokens was successful")
}

func MintGRPC(client pb.ContractServiceClient, minter, amount, status string) error {
	mintData := Mint{
		Minter: minter,
		Amount: amount,
		Status: status,
	}

	_, err := client.Mint(context.Background(), &pb.MintRequest{Minter: mintData.Minter, Amount: mintData.Amount, Status: mintData.Status})

	if err != nil {
		return fmt.Errorf("Mint token is failed")
	}

	return nil
}