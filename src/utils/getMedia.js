/* eslint-disable no-unused-expressions */
export const getMedia = async clientDevice => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: clientDevice === null ? true : { deviceId: { exact: clientDevice.deviceId } },
      video: false,
    });
  } catch (err) {
    console.log("Error:", err);
  }
};
