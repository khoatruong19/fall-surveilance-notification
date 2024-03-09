ALTER TABLE "users" ADD COLUMN "user_id" varchar(256);
ALTER TABLE "users" ADD COLUMN "device_id" varchar(256);
ALTER TABLE "users" DROP COLUMN IF EXISTS "full_name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "phone";