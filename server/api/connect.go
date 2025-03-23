package api

import (
	"database/sql"
	"fmt"
	"log"
)

func ConnectDB(user, password, host, database, sslmode, path string, port int) *sql.DB {
	log.Println("Start connect to database")

	connStr := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=%v&search_path=%v", user, password, host, port, database, sslmode, path)
	db, err := sql.Open("postgres", connStr)

	if err != nil {
		log.Fatalf("%s: %v", "Opening the database failed", err)
	} else {
		log.Println("The database has opened successfully")
	}

	return db
}
