package config

import (
	"os"
	"strconv"
)

type Config struct {
	DBHost     string
	DBPort     int
	DBUser     string
	DBPassword string
	DBName     string
	DBSsl      string
	DBPath     string

	MAILFrom        string
	MAILPasswordApp string
	MAILSmtpHost    string
	MAILSmtpPort    int

	JWTSecret  string
	ServerPort string
	GRPCUrl    string
}

func LoadConfig() *Config {
	return &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnvAsInt("DB_PORT", 5432),
		DBUser:     getEnv("DB_USER", ""), 
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBName:     getEnv("DB_NAME", ""),
		DBSsl:      getEnv("DB_SSL", "disable"),
		DBPath:     getEnv("DB_PATH", ""),

		MAILFrom:        getEnv("MAIL_FROM", ""),
		MAILPasswordApp: getEnv("MAIL_PASSWORDAPP", ""), // example: "aaaa bbbb cccc dddd" 
		MAILSmtpHost:    getEnv("MAIL_HOST", "smtp.gmail.com"),
		MAILSmtpPort:    getEnvAsInt("MAIL_PORT", 587),

		JWTSecret:  getEnv("JWT_SECRET", "supersecretkey"),
		ServerPort: getEnv("SERVER_PORT", "8080"),
		GRPCUrl:    getEnv("GRPC_URL", "0.0.0.0:50051"),
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
