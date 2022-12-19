import { API_BASE_URL } from "@env";
import * as Location from "expo-location";
import React, { createRef, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBottomSheet from "./components/common/BottomSheet";
import Loading from "./components/common/Loading";
import SearchBar from "./components/common/SearchBar";
import Map from "./components/map/Map";

export default function App() {
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [myLocation, setMyLocation] = useState<any>(null);
  const [myAddress, setMyAddress] = useState<any>(null);
  const [message, setMessage] = useState<any>();
  const [data, setData] = useState<any>([]);
  const mapRef = createRef<any>();

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
    setMessage(null);
    fetchData(filtered);
    setLocation({
      latitude: details.geometry?.location.lat,
      longitude: details.geometry?.location.lng,
    });
    setAddress(details.formatted_address);
    goToLocation;
  };

  const getMyLocation = async () => {
    setMessage("Sorry, no data available outside of the UK 😔");
    setLocation(null);
    setAddress(null);
  };

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
    //console.log(la);
    //console.log(`${API_BASE_URL}/scot-crime-by-la`);

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
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("location status denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1,
        distanceInterval: 80,
      });

      const { latitude, longitude } = loc.coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.street}, ${item.postalCode}, ${item.city}`;
        if (item.city != "UK" && !location)
          setMessage("Sorry, no data available outside of the UK 😔");
        setMyAddress(address);
      }
      setMyLocation(loc.coords);
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
        <CustomBottomSheet
          address={address ? address : myAddress}
          la={data}
          message={message}
        />
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
