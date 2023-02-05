import { API_BASE_URL } from "@env";
import * as Location from "expo-location";
import React, { Dispatch, memo, RefObject, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchScottishData } from "../../redux/slices/scotReducer";
import { API_ENDPOINTS } from "../../routes/routes";
import { darkMap } from "../../styles/darkMap";
import { useTheme } from "../../theme/ThemeProvider";
import { schedulePushNotification } from "../../utils/notifs";
import Notification from "../common/Notification";
import CurrentLocationButton from "../home/CurrentLocationButton";
import DarkModeButton from "../home/DarkModeButton";

type Props = {
  mapRef: RefObject<any>;
  coords: any;
  goToMyLocation: () => void;
  setMyLocation: Dispatch<any>;
  address: any;
  setMyAddress: Dispatch<any>;
};

/**
 * A custom map component to show regions and monitor current location.
 *
 * @param mapRef
 * @param coords
 * @param goToMyLocation
 * @param setMyLocation
 * @param setMyAddress
 */
const Map = ({
  mapRef,
  coords,
  goToMyLocation,
  setMyLocation,
  setMyAddress,
}: Props) => {
  const { isDark } = useTheme();
  let originalSubregion: string | null;
  let nextSubregion: string | null;
  const dispatch = useAppDispatch();

  // Watch current location.
  useEffect(() => {
    async function getLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("location not granted");
      }
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
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("location not granted");
      }
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

        console.log("region", originalSubregion);

        // If next region does not equal starting point.
        if (nextSubregion != originalSubregion) {
          originalSubregion = nextSubregion;

          if (response[0].subregion == "Glasgow")
            response[0].subregion = "Glasgow City";

          dispatch(fetchScottishData({ la: nextSubregion }));

          setMyLocation(coords);
          setMyAddress(response[0]);
          // schedulePushNotification({
          //   title:
          //     (!response[0]?.street ? "" : `${response[0]?.street}, `) +
          //     `${response[0]?.postalCode}, ${response[0]?.city}, ${response[0]?.country}`,
          //   body: `You've entered ${scotData.data![0]?.score} out of 10 or ${
          //     scotData.data![0]?.score_category
          //   } danger area.`,
          // });
        }
      }, 10000);
      return () => {
        clearInterval(interval);
      };
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Notification /> */}
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
        customMapStyle={isDark ? darkMap : []}
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={{
            latitude: coords?.latitude,
            longitude: coords?.longitude,
          }}
        />
      </MapView>

      <CurrentLocationButton onPress={goToMyLocation} />
      <DarkModeButton />
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
