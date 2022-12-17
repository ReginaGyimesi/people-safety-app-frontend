import React, { createRef, useEffect, useState } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import CurrentLocationButton from "../common/CurrentLocationButton";

export default function Map() {
  const [location, setLocation] = useState<any>({
    latitude: 51.5072,
    longitude: 0.1276,
  });
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
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5,
        distanceInterval: 80,
      });
      setLocation(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        minZoomLevel={15}
        maxZoomLevel={15}
        showsMyLocationButton={false}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        }}
        showsUserLocation
      />
      <CurrentLocationButton onPress={goToMyLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
