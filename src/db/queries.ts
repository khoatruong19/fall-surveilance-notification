import db from ".";

export async function getAllUserDevices(userId: string) {
  const allUserDevicec = await db.query.user_devices.findMany({
    where: (item, { eq }) => eq(item.userId, userId),
  });
  return allUserDevicec;
}

export async function getUserDevice(userId: string, deviceToken: string) {
  const userDevice = await db.query.user_devices.findFirst({
    where: (item, { eq, and }) =>
      and(eq(item.userId, userId), eq(item.deviceToken, deviceToken)),
  });

  return userDevice;
}

export async function getDeviceId(deviceSerial: string) {
  const jetsonDevice = await db.query.jetson_devices.findFirst({
    where: (item, { eq }) => eq(item.deviceSerial, deviceSerial),
  });

  return jetsonDevice?.deviceId ?? "";
}

export async function getDeviceByDeviceId(deviceId: string) {
  const jetsonDevice = await db.query.jetson_devices.findFirst({
    where: (item, { eq }) => eq(item.deviceId, deviceId),
  });

  return jetsonDevice?.deviceId ?? "";
}
