import React, { RefObject } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import CurrentLocationButton from "../common/CurrentLocationButton";

type Props = {
  mapRef: RefObject<any>;
  coords: any;
  onPress: () => void;
};

/**
 * A custom map component to show regions.
 *
 * @param mapRef
 * @param coords
 * @param onPress
 */
export default function Map({ mapRef, coords, onPress }: Props) {
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
    marginBottom: "30%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
