import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const user_devices = pgTable("user_devices", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }),
  deviceToken: varchar("device_token", { length: 256 }),
});

export const jetson_devices = pgTable("jetson_devices", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id", { length: 256 }),
  deviceSerial: varchar("device_serial", { length: 256 }),
});

export type UserDevice = InferModel<typeof user_devices>;
export type JetsonDevice = InferModel<typeof jetson_devices>;
