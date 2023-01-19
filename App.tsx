import { API_BASE_URL } from "@env";
import * as Location from "expo-location";
import React, {
  createRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBottomSheet from "./components/common/BottomSheet";
import Loading from "./components/common/Loading";
import SearchBar from "./components/common/SearchBar";
import Map from "./components/map/Map";
import { API_ENDPOINTS } from "./routes/routes";
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from "./utils/notifs";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

type Props = {
  country?: string | null;
  localAuth?: string | null;
  postcode?: string | null;
  details?: any | null;
  lat?: any | null;
  lng?: any | null;
};

const App = memo(() => {
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [myLocation, setMyLocation] = useState<any>(null);
  const [myAddress, setMyAddress] = useState<any>(null);
  const [message, setMessage] = useState<any>();
  const [data, setData] = useState<any>([]);
  const [enData, setEnData] = useState<any>([]);
  const [isScot, setScot] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const mapRef = createRef<any>();

  //const [expoPushToken, setExpoPushToken] = useState("");
  //const [notification, setNotification] = useState(false);
  //const notificationListener = useRef<any>();
  //const responseListener = useRef<any>();

  // Fetch Scottish data by local authority.
  const fetchScottishData = async (la: any) => {
    setLoading(true);
    await fetch(`${API_BASE_URL}/${API_ENDPOINTS.crimeByLa}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        la: la,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("fetching scot data...");
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  // Fetch English data by postcode.
  const fetchEnglishData = async (po: any) => {
    setLoading(true);
    await fetch(`${API_BASE_URL}/${API_ENDPOINTS.crimeByPo}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        po: po,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("fetching en data...");
        setEnData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  // Fetch details if country is either Scotland or England
  // and navigate to location.
  const fetchDetailsBasedOnLocation = ({
    country,
    localAuth,
    postcode,
    lat,
    lng,
    details,
  }: Props) => {
    const sanitisedPo = postcode?.replace(/\s/g, "");

    setLocation({
      latitude: lat,
      longitude: lng,
    });

    console.log(details);

    setAddress(details?.formatted_address);
    setMessage(null);

    console.log("country ", country);

    // TODO: location names might differ from stored names
    if (localAuth == "Glasgow") localAuth = "Glasgow City";
    if (country == "Scotland") {
      setScot(true);
      fetchScottishData(localAuth);
    } else if (country == "England") {
      setScot(false);
      fetchEnglishData(sanitisedPo);
    } else {
      setMessage("Sorry, no data available outside of England and Scotland 😔");
    }

    goToLocation;
  };

  // Navigate to selected location or current location.
  const goToLocation = () => {
    if (location.latitude && location.longitude) {
      console.log("navigating to location...");
      mapRef.current?.animateToRegion({
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
    }
    if (myLocation) {
      fetchDetailsBasedOnLocation({
        country: myAddress?.region,
        lat: myLocation.latitude,
        lng: myLocation.longitude,
        localAuth: myAddress?.city,
        postcode: myAddress?.postalCode,
      });
      mapRef.current?.animateToRegion({
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
      });
    }
  };

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token: any) =>
  //     setExpoPushToken(token)
  //   );

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification: any) => {
  //       setNotification(notification);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       //console.log(response);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        // London is default location if location sharing is not allowed.
        setMyLocation({
          latitude: 51.513955,
          longitude: -0.132913,
        });

        // Get location details from longitude and latitude.
        let response = await Location.reverseGeocodeAsync({
          latitude: 51.513955,
          longitude: -0.132913,
        });
        setMyAddress(response[0]);
        fetchDetailsBasedOnLocation({
          country: response[0].region,
          lat: 51.513955,
          lng: -0.132913,
          postcode: response[0].postalCode,
          localAuth: response[0].city,
        });

        console.log("location status denied");
      }

      // If location sharing is allowed set current location.
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1,
        distanceInterval: 1,
      });

      // Location longitude and latitude.
      const { latitude, longitude } = loc.coords;

      // Get location details from longitude and latitude.
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      setMyAddress(response[0]);
      setMyLocation(loc?.coords);
      if (
        response[0].city != "UK" ||
        response[0].country != "United Kingdom" ||
        (response[0].region != "England" && response[0].region != "Scotland")
      )
        setMessage(
          "Sorry, no data available outside of England and Scotland 😔"
        );

      if (enData.length == 0 && data.length == 0)
        fetchDetailsBasedOnLocation({
          country: response[0].region,
          lat: loc?.coords.latitude,
          lng: loc?.coords.longitude,
          localAuth: response[0].city,
          postcode: response[0].postalCode,
        });
    })();
  }, []);

  useEffect(() => {
    if (enData[0] == "No data found." || data[0] == "No data found.") {
      setMessage(
        "Oops, nothing to see here. 👀 Try searching with a full postcode."
      );
    }
  }, [enData, data]);

  console.log(location, myLocation);

  // useEffect(() => {
  //   if (!isLoading && !isScot) {
  //     schedulePushNotification({
  //       title: address ?? "",
  //       body: `You've entered ${enData[0]?.score} out of 10 or ${enData[0]?.score_category} danger area.`,
  //     });
  //   }
  //   if (!isLoading && isScot) {
  //     schedulePushNotification({
  //       title: address ?? "",
  //       body: `You've entered ${data[0]?.score} out of 10 or ${data[0]?.score_category} danger area.`,
  //     });
  //   }
  // }, [enData, data, isLoading]);

  // Return loading screen if default or current location and address are not present or data cannot be fetched.
  if (!myLocation && !myAddress && (enData.length == 0 || data.length == 0))
    return <Loading />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar searchLocation={fetchDetailsBasedOnLocation} />
        <Map
          mapRef={mapRef}
          coords={
            location?.latitude || location?.longitude ? location : myLocation
          }
          goToMyLocation={goToLocation}
        />
        <CustomBottomSheet
          address={
            address
              ? address
              : `${myAddress?.street}, ${myAddress?.postalCode}, ${myAddress?.city}, ${myAddress?.country}`
          }
          data={!isScot ? enData : data}
          message={message}
          isLoading={isLoading}
        />
      </View>
    </GestureHandlerRootView>
  );
});

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    height: "100%",
  },
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
