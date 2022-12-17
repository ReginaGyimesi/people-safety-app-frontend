import React, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";

export default function Map() {
  const [location, setLocation] = useState<LocationObject>();
  const mapRef = React.createRef<any>();

  const goToMyLocation = async () => {
    mapRef.current.animateCamera({
      center: {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      },
    });
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        //enableHighAccuracy: true,
        timeInterval: 5,
      });
      setLocation(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} ref={mapRef} />
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
