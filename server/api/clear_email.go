package api

import (
	"database/sql"
	"log"
)

func ClearEmail(database *sql.DB) {
	query := `DELETE FROM email_confirmation WHERE to_timestamp(time) < NOW() - INTERVAL '24 hours'`
	_, err := database.Exec(query)

	if err != nil {
		log.Println("The data in the email_confirmation field has not been deleted")
	} else {
		log.Println("The data in the email_confirmation has been deleted")
	}
}
