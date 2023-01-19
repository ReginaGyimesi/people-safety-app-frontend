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
import { filterCountry, filterLa, filterPostCode } from "./utils/common";
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

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

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
    console.log(postcode);
    const sanitisedPo = postcode?.replace(/\s/g, "");

    setLocation({
      latitude: lat,
      longitude: lng,
    });

    setAddress(details?.formatted_address);
    setMessage(null);

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
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
    }
    if (myLocation) {
      fetchDetailsBasedOnLocation({
        country: myAddress.region,
        lat: myLocation.latitude,
        lng: myLocation.longitude,
        localAuth: myAddress.city,
        postcode: myAddress.postalCode,
      });
      mapRef.current?.animateToRegion({
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
      });
    }
  };

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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // London is default location if location sharing is not allowed.
        setMyLocation({
          latitude: 51.513955,
          longitude: -0.132913,
        });
        let response = await Location.reverseGeocodeAsync({
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
        });
        setMyAddress(response[0]);
        fetchDetailsBasedOnLocation({
          country: myAddress.region,
          postcode: myAddress.postalCode,
          localAuth: myAddress.city,
        });

        console.log("location status denied");
      }

      // If location sharing is allowed set current location.
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1,
        distanceInterval: 80,
      });

      // Location longitude and latitude.
      const { latitude, longitude } = loc.coords;

      // Get location details from longitude and latitude.
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response[0].city != "UK" || response[0].region != "England")
        setMessage(
          "Sorry, no data available outside of England and Scotland 😔"
        );
      setMyAddress(response);
      setMyLocation(loc.coords);

      if (!location && enData.length == 0 && data.length == 0)
        fetchDetailsBasedOnLocation({
          country: response[0].region,
          postcode: response[0].postalCode,
          localAuth: response[0].subregion,
        });
    })();
  }, []);

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

  if (!myLocation) return <Loading />;
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
