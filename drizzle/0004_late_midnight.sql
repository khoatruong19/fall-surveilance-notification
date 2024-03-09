CREATE TABLE IF NOT EXISTS "user_devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256),
	"device_token" varchar(256)
);

DROP TABLE "users";