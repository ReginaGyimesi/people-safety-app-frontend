import * as Location from "expo-location";
import React, { createRef, memo, useEffect, useState } from "react";
import { LogBox, StyleSheet, View } from "react-native";
import Loading from "../components/common/Loading";
import CustomBottomSheet from "../components/home/BottomSheet";
import SearchBar from "../components/home/SearchBar";
import Map from "../components/map/Map";
import { ScotContext, ScotDispatchContext } from "../context/provider";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import {
  fetchEnglishData,
  fetchNeighbouringEn,
} from "../redux/slices/enReducer";
import {
  fetchNeighbouringScot,
  fetchScottishData,
} from "../redux/slices/scotReducer";

LogBox.ignoreAllLogs();

type Props = {
  country?: string | null;
  localAuth?: string | null;
  postcode?: string | null;
  details?: any | null;
  lat?: any | null;
  lng?: any | null;
};

const HomeScreen = memo(() => {
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [myLocation, setMyLocation] = useState<any>(null);
  const [myAddress, setMyAddress] = useState<any>(null);
  const [message, setMessage] = useState<any>();
  const mapRef = createRef<any>();

  const dispatch = useAppDispatch();
  const scotData = useAppSelector((s) => s.scotData);
  const enData = useAppSelector((s) => s.enData);

  const isScot = React.useContext(ScotContext);
  const setScot = React.useContext(ScotDispatchContext);

  async function onNeighbourClick(id: number) {
    if (isScot) {
      let response = await Location.reverseGeocodeAsync({
        latitude: scotData.neighbours[0].lat[id],
        longitude: scotData.neighbours[0].lon[id],
      });

      fetchDetailsBasedOnLocation({
        country: response[0].region,
        localAuth: response[0].subregion,
        lat: scotData.neighbours[0].lat[id],
        lng: scotData.neighbours[0].lon[id],
        details: {
          formatted_address: `${
            response[0].streetNumber ? `${response[0].streetNumber} ` : ""
          }${response[0].street ? `${response[0].street} ` : ""}${
            response[0].postalCode
          } ${response[0].subregion}`,
        },
      });
    }
    if (!isScot) {
      let res = await Location.reverseGeocodeAsync({
        latitude: enData.neighbours[0]?.lat[id],
        longitude: enData.neighbours[0]?.lon[id],
      });

      fetchDetailsBasedOnLocation({
        country: res[0].region,
        lat: enData.neighbours[0]?.lat[id],
        lng: enData.neighbours[0]?.lon[id],
        postcode: res[0].postalCode,
        details: {
          formatted_address: `${
            res[0].streetNumber ? `${res[0].streetNumber} ` : ""
          }${res[0].street ? `${res[0].street} ` : ""}${res[0].postalCode} ${
            res[0].subregion
          }`,
        },
      });
    }
  }

  // Fetch details if country is either Scotland or England
  // and navigate to location.
  async function fetchDetailsBasedOnLocation({
    country,
    localAuth,
    postcode,
    lat,
    lng,
    details,
  }: Props) {
    const sanitisedPo = postcode?.replace(/\s/g, "");

    setLocation({
      latitude: lat,
      longitude: lng,
    });

    setAddress(details?.formatted_address);
    setMessage(null);

    console.log("country", country);
    console.log("local auth", localAuth);

    // Location names might differ from stored names.
    if (localAuth == "East Renfrewshire")
      localAuth = "East Renfrewshire Council";
    if (localAuth == "North Ayrshire Council") localAuth = "North Ayrshire";
    if (localAuth == "East Lothian Council") localAuth = "East Lothian";
    if (localAuth == "Na h-Eileanan an Iar") localAuth = "Na h-Eileanan Siar";
    if (localAuth == "Orkney") localAuth = "Orkney Islands";
    if (localAuth == "Dundee") localAuth = "Dundee City Council";
    if (localAuth == "Aberdeen") localAuth = "Aberdeen City";
    if (localAuth == "Glasgow") localAuth = "Glasgow City";
    if (localAuth == "East Dunbartonshire Council")
      localAuth = "East Dunbartonshire";
    if (localAuth == "Perth") localAuth = "Perth and Kinross";
    if (localAuth == "Highland") localAuth = "Highland Council";
    if (localAuth == "West Dunbartonshire")
      localAuth = "West Dunbartonshire Council";

    if (country == "Scotland") {
      setScot(true);
      dispatch(fetchScottishData({ la: localAuth }));

      if (localAuth == "East Renfrewshire Council")
        localAuth = "East Renfrewshire";
      if (localAuth == "West Dunbartonshire Council")
        localAuth = "West Dunbartonshire";
      if (localAuth == "East Renfrewshire Council")
        localAuth = "East Renfrewshire";
      if (localAuth == "Highland Council") localAuth = "Highland";
      if (localAuth == "Dundee City Council") localAuth = "Dundee City";
      if (localAuth == "Edinburgh") localAuth = "City of Edinburgh";
      dispatch(fetchNeighbouringScot({ la: localAuth }));
    } else if (country == "England") {
      setScot(false);
      dispatch(fetchEnglishData({ po: sanitisedPo }));
      dispatch(fetchNeighbouringEn({ po: sanitisedPo }));
    } else {
      setMessage(
        "Sorry, no data available outside of England and Scotland 😔 We're working on it!"
      );
    }

    goToLocation;
  }

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
          latitude: 55.8621,
          longitude: -4.2424,
        });

        // Get location details from longitude and latitude.
        let response = await Location.reverseGeocodeAsync({
          latitude: 55.8621,
          longitude: -4.2424,
        });
        setMyAddress(response[0]);
        await fetchDetailsBasedOnLocation({
          country: response[0].region,
          lat: 55.8621,
          lng: -4.2424,
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

      if (!enData.data && !scotData.data)
        fetchDetailsBasedOnLocation({
          country: response[0].region,
          lat: loc?.coords.latitude,
          lng: loc?.coords.longitude,
          localAuth: response[0].subregion,
          postcode: response[0].postalCode,
        });
    })();
  }, []);

  console.log(message);
  useEffect(() => {
    const msg = "Oops, nothing to see here. 👀 We're working on it!";
    if (
      enData.data &&
      enData.data[0] == "No data found for post code." &&
      !isScot &&
      !enData.loading
    ) {
      setMessage(msg);
    } else if (
      scotData.data &&
      scotData.data[0] == "No data found for local authority." &&
      isScot &&
      !scotData.loading
    ) {
      setMessage(null);
    }
  }, [enData.data, scotData.data]);

  console.log(enData, isScot);

  // Return loading screen if default or current location and address are not present or data cannot be fetched.
  if (!myLocation || !myAddress) return <Loading />;

  return (
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
        setMyAddress={setMyAddress}
      />
      <CustomBottomSheet
        address={
          address
            ? address
            : (!myAddress?.street ? "" : `${myAddress?.street}, `) +
              `${myAddress?.postalCode}, ${myAddress?.city}, ${myAddress?.country}`
        }
        data={!isScot ? enData.data : scotData.data}
        message={message}
        isLoading={scotData.loading || enData.loading}
        neighbours={isScot ? scotData.neighbours : enData.neighbours}
        onNeighbourClick={onNeighbourClick}
      />
    </View>
  );
});

export default HomeScreen;

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
