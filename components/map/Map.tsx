import React from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import CurrentLocationButton from "../common/CurrentLocationButton";
import SearchBar from "../common/SearchBar";

export default function Map({ mapRef, location, onPress }: any) {
  return (
    <View style={styles.container}>
      <SearchBar />
      <MapView
        style={styles.map}
        ref={mapRef}
        minZoomLevel={15}
        maxZoomLevel={15}
        showsMyLocationButton={false}
        region={{
          latitude: location.coords?.latitude,
          longitude: location.coords?.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
      />
      <CurrentLocationButton onPress={onPress} />
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
