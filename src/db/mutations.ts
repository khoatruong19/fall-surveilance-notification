import { eq } from "drizzle-orm";
import db from ".";
import { AddJetsonDeviceBody, AddUserDeviceBody } from "../utils/inputSchema";
import { UserDevice, user_devices } from "./schema";

export async function insertUserDevice(
  newDevice: AddUserDeviceBody
): Promise<UserDevice | null> {
  const userDevice = await db
    .insert(user_devices)
    .values({ ...newDevice, deviceToken: newDevice.token })
    .returning();

  return userDevice[0] ?? null;
}
