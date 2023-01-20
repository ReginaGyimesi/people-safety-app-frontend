import { API_BASE_URL } from "@env";
import * as Location from "expo-location";
import { scheduleNotificationAsync } from "expo-notifications";
import React, { Dispatch, memo, RefObject, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { API_ENDPOINTS } from "../../routes/routes";
import { fetchPointInLa, fetchScottishData } from "../../utils/api";
import { schedulePushNotification } from "../../utils/notifs";
import Notification from "../common/Notification";
import CurrentLocationButton from "../home/CurrentLocationButton";

type Props = {
  mapRef: RefObject<any>;
  coords: any;
  goToMyLocation: () => void;
  setMyLocation: Dispatch<any>;
  address: any;
  setData: Dispatch<any>;
  setMyAddress: Dispatch<any>;
  myLocation: any;
};

/**
 * A custom map component to show regions and monitor current location.
 *
 * @param mapRef
 * @param coords
 * @param goToMyLocation
 * @param setMyLocation
 * @param setData
 * @param setMyAddress
 * @param myLocation
 */
const Map = ({
  mapRef,
  coords,
  goToMyLocation,
  setMyLocation,
  setData,
  setMyAddress,
  myLocation,
}: Props) => {
  let originalSubregion: string | null;
  let nextSubregion: string | null;

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

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      originalSubregion = response[0].subregion;
      console.log("original subregion", originalSubregion);
      setMyLocation(coords);
    }

    getLocation();
  }, []);

  useEffect(() => {
    let interval = setInterval(async () => {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1,
        distanceInterval: 1,
      });

      // Location longitude and latitude.
      const { latitude, longitude } = loc.coords;

      // Set coords.
      coords = { latitude, longitude };

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      nextSubregion = response[0].subregion;

      // If next region does not equal starting point.
      if (nextSubregion != originalSubregion) {
        originalSubregion = nextSubregion;

        if (response[0].subregion == "Glasgow")
          response[0].subregion = "Glasgow City";

        await fetch(`${API_BASE_URL}/${API_ENDPOINTS.crimeByLa}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            la: nextSubregion,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("fetching scot data...");
            setData(data);
            setMyLocation(coords);
            setMyAddress(response[0]);
            schedulePushNotification({
              title:
                (!response[0].street ? "" : `${response[0]?.street}, `) +
                `${response[0].postalCode}, ${response[0].city}, ${response[0].country}`,
              body: `You've entered ${data[0].score} out of 10 or ${data[0].score_category} danger area.`,
            });
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Notification />
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
};

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
