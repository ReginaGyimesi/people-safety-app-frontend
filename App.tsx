import React, { createRef, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBottomSheet from "./components/common/BottomSheet";
import SearchBar from "./components/common/SearchBar";
import Map from "./components/map/Map";
import * as Location from "expo-location";
import {
  BottomSheetModalProvider,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import Loading from "./components/common/Loading";
import { API_BASE_URL } from "@env";
import { GooglePlaceData } from "react-native-google-places-autocomplete";

export default function App() {
  const [location, setLocation] = useState<any>(null);
  const [myLocation, setMyLocation] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [myAddress, setMyAddress] = useState<any>(null);
  const mapRef = createRef<any>();
  const [data, setData] = useState<any>([]);

  const goToLocation = () => {
    if (location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
    if (myLocation) {
      getMyLocation();
      mapRef.current.animateToRegion({
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
      });
    }
  };

  const getMyLocation = async () => {
    setLocation(null);
    setAddress(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`https://cd16-84-0-25-186.eu.ngrok.io/scot-crime-by-la`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          la: "Glasgow City",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("location status denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1,
        distanceInterval: 80,
      });

      const { latitude, longitude } = location.coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.street}, ${item.postalCode}, ${item.city}`;

        setMyAddress(address);
      }
      setMyLocation(location.coords);
    })();

    if (!location) {
      getMyLocation();
    }
  }, []);

  if (!myLocation) return <Loading />;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar
          setCurrentAddress={setAddress}
          setLocation={setLocation}
          goToMyLocation={goToLocation}
        />
        <Map
          mapRef={mapRef}
          coords={location ? location : myLocation}
          onPress={goToLocation}
        />
        <CustomBottomSheet address={address ? address : myAddress} la={data} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
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
