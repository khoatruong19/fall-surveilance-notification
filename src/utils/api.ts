const getDeviceBySerial = async (serial: string) => {
  try {
    const url = `http://14.225.204.127/api/device-services/devices/serial-number/${serial}/`;

    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export default { getDeviceBySerial };
