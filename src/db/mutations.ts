import { eq } from "drizzle-orm";
import db from ".";
import { AddJetsonDeviceBody, AddUserDeviceBody } from "../utils/inputSchema";
import {
  JetsonDevice,
  UserDevice,
  jetson_devices,
  user_devices,
} from "./schema";

export async function insertUserDevice(
  newDevice: AddUserDeviceBody
): Promise<UserDevice | null> {
  const userDevice = await db
    .insert(user_devices)
    .values({ ...newDevice, deviceToken: newDevice.token })
    .returning();

  return userDevice[0] ?? null;
}

export async function insertJetsonDevice(
  newDevice: AddJetsonDeviceBody
): Promise<JetsonDevice | null> {
  const jetsonDevice = await db
    .insert(jetson_devices)
    .values(newDevice)
    .returning();

  return jetsonDevice[0] ?? null;
}

export async function deleteJetsonDevice(deviceId: string): Promise<boolean> {
  try {
    await db
      .delete(jetson_devices)
      .where(eq(jetson_devices.deviceId, deviceId));
    return true;
  } catch (error) {
    return false;
  }
}
