import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { registerForPushNotificationsAsync } from "../../utils/notifs";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Notification component to trigger notification upon entering an area.
 * @see https://docs.expo.dev/versions/latest/sdk/notifications/
 */
export default function Notification() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: any) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification: any) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // useEffect(() => {
  //   if (!isLoading && !isScot) {
  //   if (!isLoading && isScot) {
  //     schedulePushNotification({
  //       title: address ?? "",
  //       body: `You've entered ${data[0]?.score} out of 10 or ${data[0]?.score_category} danger area.`,
  //     });
  //   }
  // }, [enData, data, isLoading]);
  return <></>;
}
