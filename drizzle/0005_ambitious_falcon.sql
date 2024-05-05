CREATE TABLE IF NOT EXISTS "jetson_devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(256),
	"device_serial" varchar(256)
);
