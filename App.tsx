import { LogBox } from "react-native";
import * as Location from "expo-location";
import React, { createRef, memo, useEffect, useState } from "react";
import { Appearance, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Loading from "./components/common/Loading";
import CustomBottomSheet from "./components/home/BottomSheet";
import SearchBar from "./components/home/SearchBar";
import Map from "./components/map/Map";
import {
  fetchEnglishData,
  fetchEnglishNeighbouringAreas,
  fetchScottishData,
  fetchScottishNeighbouringAreas,
} from "./utils/api";
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";
import { API_BASE_URL } from "@env";
import { API_ENDPOINTS } from "./routes/routes";

LogBox.ignoreAllLogs();

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

  const [scotNeighbours, setScotNeighbours] = useState<any>(null);
  const [enNeighbours, setEnNeighbours] = useState<any>(null);

  async function onNeighbourClick(id: number) {
    let response = await Location.reverseGeocodeAsync({
      latitude: scotNeighbours[0].lat[id],
      longitude: scotNeighbours[0].lon[id],
    });

    fetchDetailsBasedOnLocation({
      country: response[0].region,
      localAuth: response[0].subregion,
      lat: scotNeighbours[0].lat[id],
      lng: scotNeighbours[0].lon[id],
      details: {
        formatted_address: `${
          response[0].streetNumber ? `${response[0].streetNumber} ` : ""
        }${response[0].street ? `${response[0].street} ` : ""}${
          response[0].postalCode
        } ${response[0].subregion}`,
      },
    });
  }

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

    setAddress(details?.formatted_address);
    setMessage(null);

    console.log("country", country);
    console.log("local auth", localAuth);

    // FIXME: location names might differ from stored names
    if (localAuth == "Glasgow") localAuth = "Glasgow City";
    if (localAuth == "West Dunbartonshire Council")
      localAuth = "West Dunbartonshire";
    if (localAuth == "East Dunbartonshire Council")
      localAuth = "East Dunbartonshire";
    if (country == "Scotland") {
      setScot(true);
      fetchScottishData({
        la: localAuth,
        setData: setData,
        setLoading: setLoading,
      });
      fetchScottishNeighbouringAreas({
        la: localAuth,
        setData: setScotNeighbours,
        setLoading: setLoading,
      });
    } else if (country == "England") {
      setScot(false);
      fetchEnglishData({
        po: sanitisedPo,
        setData: setEnData,
        setLoading: setLoading,
      });
      fetchEnglishNeighbouringAreas({
        po: sanitisedPo,
        setData: setEnNeighbours,
        setLoading: setLoading,
      });
    } else {
      setMessage(
        "Sorry, no data available outside of England and Scotland 😔 We're working on it!"
      );
    }

    goToLocation;
  };

  console.log("data", data);

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
        localAuth: myAddress?.subregion,
        postcode: myAddress?.postalCode,
      });
      mapRef.current?.animateToRegion({
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
      });
    }
  };

  useEffect(() => {
    (async () => {
      // Ask for location sharing permission.
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
        console.log(response[0].postalCode);
        await fetchDetailsBasedOnLocation({
          country: response[0].region,
          lat: 51.513955,
          lng: -0.132913,
          postcode: response[0].postalCode,
          localAuth: response[0].subregion,
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
          localAuth: response[0].subregion,
          postcode: response[0].postalCode,
        });
    })();
  }, []);

  useEffect(() => {
    if (enData[0] == "No data found.") {
      setMessage("Oops, nothing to see here. 👀 We're working on it!");
    } else if (data[0] == "No data found.") {
      setMessage("Oops, nothing to see here. 👀 We're working on it!");
    }
  }, [enData, data]);

  // console.log(data, enData);

  // Return loading screen if default or current location and address are not present or data cannot be fetched.
  if (!myLocation && !myAddress && (enData.length == 0 || data.length == 0))
    return <Loading />;

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <SearchBar searchLocation={fetchDetailsBasedOnLocation} />
          <Map
            mapRef={mapRef}
            coords={
              location?.latitude || location?.longitude ? location : myLocation
            }
            goToMyLocation={goToLocation}
            setMyLocation={setMyLocation}
            address={
              (!myAddress?.street ? "" : `${myAddress?.street}, `) +
              `${myAddress?.postalCode}, ${myAddress?.city}, ${myAddress?.country}`
            }
            setData={setData}
            setMyAddress={setMyAddress}
          />
          <CustomBottomSheet
            address={
              address
                ? address
                : (!myAddress?.street ? "" : `${myAddress?.street}, `) +
                  `${myAddress?.postalCode}, ${myAddress?.city}, ${myAddress?.country}`
            }
            data={!isScot ? enData : data}
            message={message}
            isLoading={isLoading}
            neighbours={isScot ? scotNeighbours : enNeighbours}
            onNeighbourClick={onNeighbourClick}
          />
        </View>
      </GestureHandlerRootView>
    </ThemeProvider>
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
