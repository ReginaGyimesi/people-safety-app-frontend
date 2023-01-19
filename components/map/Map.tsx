import React, { RefObject, useEffect, useState, memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import CurrentLocationButton from "../common/CurrentLocationButton";
import * as Location from "expo-location";

type Props = {
  mapRef: RefObject<any>;
  coords: any;
  goToMyLocation: () => void;
};

/**
 * A custom map component to show regions.
 *
 * @param mapRef
 * @param coords
 * @param goToMyLocation
 */
const Map = memo(({ mapRef, coords, goToMyLocation }: Props) => {
  // Watch location.
  useEffect(() => {
    async function getLocation() {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1,
        distanceInterval: 1,
      });

      // Location longitude and latitude.
      const { latitude, longitude } = loc.coords;

      // Set coords.
      coords = { latitude, longitude };
    }
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        showsMyLocationButton={false}
        region={{
          latitude: coords?.latitude,
          longitude: coords?.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: coords?.latitude,
            longitude: coords?.longitude,
          }}
        />
      </MapView>

      <CurrentLocationButton onPress={goToMyLocation} />
    </View>
  );
});

export default Map;

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
