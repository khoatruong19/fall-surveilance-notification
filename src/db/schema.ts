import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const user_devices = pgTable("user_devices", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }),
  deviceToken: varchar("device_token", { length: 256 }),
});

export type UserDevice = InferModel<typeof user_devices>;
