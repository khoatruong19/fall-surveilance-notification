import db from ".";
import { AddUserDeviceBody } from "../utils/inputSchema";
import { UserDevice, user_devices } from "./schema";

export async function insertUserDevice(newDevice: AddUserDeviceBody): Promise<UserDevice | null> {
    const userDevice = await db.insert(user_devices).values(newDevice).returning()
  
    return userDevice[0] ?? null;
}