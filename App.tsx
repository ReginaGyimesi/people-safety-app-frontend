import React, { createRef, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBottomSheet from "./components/common/BottomSheet";
import SearchBar from "./components/common/SearchBar";
import Map from "./components/map/Map";
import * as Location from "expo-location";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function App() {
  const [location, setLocation] = useState<any>({
    latitude: 51.5072,
    longitude: 0.1276,
  });
  const [currentAddres, setCurrentAddres] = useState("");
  const mapRef = createRef<any>();

  const goToMyLocation = async () => {
    if (location) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("location status denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5,
        distanceInterval: 80,
      });
      setLocation(location);
      if (location.coords) {
        const { latitude, longitude } = location.coords;
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        for (let item of response) {
          let address = `${item.street}, ${item.postalCode}, ${item.city}`;

          setCurrentAddres(address);
        }
      }
    })();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Map mapRef={mapRef} location={location} onPress={goToMyLocation} />
        <CustomBottomSheet address={currentAddres} />
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
});
