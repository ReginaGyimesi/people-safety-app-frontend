import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Push notification scheduler.
 * @see https://docs.expo.dev/versions/latest/sdk/notifications/
 *
 * @param title
 * @param body
 */
export async function schedulePushNotification({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      //data: { data: "goes here" },
      autoDismiss: true,
      sticky: true,
    },
    trigger: {},
  });
}

/**
 * Push notification registry.
 * @see https://docs.expo.dev/versions/latest/sdk/notifications/
 */
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
