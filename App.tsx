import React, { createRef, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBottomSheet from "./components/common/BottomSheet";
import SearchBar from "./components/common/SearchBar";
import Map from "./components/map/Map";
import * as Location from "expo-location";
import {
  BottomSheetModalProvider,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import Loading from "./components/common/Loading";
import { API_BASE_URL } from "@env";
import { GooglePlaceData } from "react-native-google-places-autocomplete";

export default function App() {
  const [location, setLocation] = useState<any>(null);
  const [myLocation, setMyLocation] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [myAddress, setMyAddress] = useState<any>(null);
  const mapRef = createRef<any>();
  const [data, setData] = useState<any>([]);
  const [search, setSearch] = useState<any>([]);
  const [filtered, setFiltered] = useState<any>(null);

  const goToLocation = () => {
    if (location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
    if (myLocation) {
      getMyLocation();
      mapRef.current.animateToRegion({
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
      });
    }
  };

  const searchLocation = (details: any) => {
    const filtered = filterLa(details);
    fetchData(filtered);
    setLocation({
      latitude: details.geometry?.location.lat,
      longitude: details.geometry?.location.lng,
    });
    setAddress(details.formatted_address);
    setSearch(details);
    goToLocation;
  };

  const getMyLocation = async () => {
    setLocation(null);
    setAddress(null);
  };

  console.log(`${API_BASE_URL}/scot-crime-by-la`);

  const filterLa = (details: any) => {
    var filtered_array = details?.address_components.filter(
      function (address_component: { types: string | string[] }) {
        return address_component.types.includes("administrative_area_level_2");
      }
    );
    var county = filtered_array?.length ? filtered_array[0].long_name : "";

    return county;
  };

  const fetchData = async (la: any) => {
    console.log(la);
    await fetch(`${API_BASE_URL}/scot-crime-by-la`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        la: la,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
    console.log(data);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("location status denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1,
        distanceInterval: 80,
      });

      const { latitude, longitude } = location.coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.street}, ${item.postalCode}, ${item.city}`;

        setMyAddress(address);
      }
      setMyLocation(location.coords);
    })();

    if (!location) {
      getMyLocation();
    }
  }, []);
  if (!myLocation) return <Loading />;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar searchLocation={searchLocation} />
        <Map
          mapRef={mapRef}
          coords={location ? location : myLocation}
          onPress={goToLocation}
        />
        <CustomBottomSheet address={address ? address : myAddress} la={data} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
