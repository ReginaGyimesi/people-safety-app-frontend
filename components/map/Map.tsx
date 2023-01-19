import React, { RefObject } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import CurrentLocationButton from "../common/CurrentLocationButton";

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
export default function Map({ mapRef, coords, goToMyLocation }: Props) {
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
        showsUserLocation={true}
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
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
