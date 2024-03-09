CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256),
	"device_token" varchar(256)
);
