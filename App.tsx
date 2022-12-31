import { API_BASE_URL } from "@env";
import * as Location from "expo-location";
import React, { createRef, memo, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBottomSheet from "./components/common/BottomSheet";
import Loading from "./components/common/Loading";
import SearchBar from "./components/common/SearchBar";
import Map from "./components/map/Map";
import { filterCountry, filterLa, filterPostCode } from "./utils/common";

const App = memo(() => {
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [myLocation, setMyLocation] = useState<any>(null);
  const [myAddress, setMyAddress] = useState<any>(null);
  const [message, setMessage] = useState<any>();
  const [data, setData] = useState<any>([]);
  const [enData, setEnData] = useState<any>([]);
  const [isScot, setScot] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const mapRef = createRef<any>();

  const goToLocation = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
    if (myLocation) {
      getMyLocation();
      mapRef.current?.animateToRegion({
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
      });
    }
  };

  const getMyLocation = () => {
    setMessage("Sorry, no data available outside of England and Scotland 😔");
    setLocation(null);
    setAddress(null);
  };

  const searchLocation = (details: any) => {
    const country = filterCountry(details);
    const filtered = filterLa(details);
    const postcodeFromLsoa = filterPostCode(details);
    const po = postcodeFromLsoa?.short_name;
    const sanitisedPo = po?.replace(/\s/g, "");

    setLocation({
      latitude: details.geometry?.location.lat,
      longitude: details.geometry?.location.lng,
    });

    console.log("country " + country);
    setAddress(details.formatted_address);

    if (country == "Scotland") {
      setScot(true);
      fetchScottishData(filtered);
      setMessage(null);
    } else if (country == "England") {
      setScot(false);
      fetchEnglishData(sanitisedPo);
      setMessage(null);
    } else {
      setMessage("Sorry, no data available outside of England and Scotland 😔");
    }
    if (!isLoading) {
      goToLocation;
    }
  };

  const fetchScottishData = async (la: any) => {
    //console.log(la);
    //console.log(`${API_BASE_URL}/scot-crime-by-la`);

    setLoading(true);
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
        console.log("fetching scot data...");
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  const fetchEnglishData = async (po: any) => {
    setLoading(true);
    await fetch(`${API_BASE_URL}/crime-by-po`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        po: po,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("fetching en data...");
        setEnData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
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
        if (item.city != "UK")
          setMessage(
            "Sorry, no data available outside of England and Scotland 😔"
          );
        setMyAddress(address);
      }
      setMyLocation(loc.coords);
    })();
    if (!location) getMyLocation();
  }, []);

  console.log(data, enData);

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
          data={!isScot ? enData : data}
          message={message}
          isLoading={isLoading}
        />
      </View>
    </GestureHandlerRootView>
  );
});

export default App;

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
