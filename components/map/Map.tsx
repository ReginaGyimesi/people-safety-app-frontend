import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import CurrentLocationButton from "../common/CurrentLocationButton";
import SearchBar from "../common/SearchBar";

export default function Map({ mapRef, coords, onPress }: any) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        minZoomLevel={15}
        maxZoomLevel={15}
        showsMyLocationButton={false}
        region={{
          latitude: coords?.latitude,
          longitude: coords?.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: coords?.latitude,
            longitude: coords?.longitude,
          }}
        />
      </MapView>
      <CurrentLocationButton onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 100,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
