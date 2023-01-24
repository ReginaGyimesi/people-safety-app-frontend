import { API_BASE_URL } from "@env";
import * as Location from "expo-location";
import React, { Dispatch, memo, RefObject, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { API_ENDPOINTS } from "../../routes/routes";
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
  setData: Dispatch<any>;
  setMyAddress: Dispatch<any>;
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
 */
const Map = ({
  mapRef,
  coords,
  goToMyLocation,
  setMyLocation,
  setData,
  setMyAddress,
}: Props) => {
  const { isDark } = useTheme();
  let originalSubregion: string | null;
  let nextSubregion: string | null;

  //TODO: implement this so it sends
  let originalPostcode;
  let nextPostcode;

  // Watch location.
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
          if (response[0].subregion == "West Dunbartonshire")
            response[0].subregion = "West Dunbartonshire Council";

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
              console.log("fetching scot data...", data);
              setData(data);
              setMyLocation(coords);
              setMyAddress(response[0]);
              schedulePushNotification({
                title:
                  (!response[0]?.street ? "" : `${response[0]?.street}, `) +
                  `${response[0]?.postalCode}, ${response[0]?.city}, ${response[0]?.country}`,
                body: `You've entered ${data[0]?.score} out of 10 or ${data[0]?.score_category} danger area.`,
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
    })();
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

const darkMap = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];
