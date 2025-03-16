package grpc

import (
	"log"
	"payfine/config"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func ConnectGRPC() *grpc.ClientConn {
	cfg := config.LoadConfig()
	conn, err := grpc.NewClient(cfg.GRPCUrl, grpc.WithTransportCredentials(insecure.NewCredentials()))

	if err != nil {
		log.Fatalf("connect to gRPC-server is failed: %v", err)
	} 

	return conn
}
