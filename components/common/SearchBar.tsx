import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { colors } from "../../styles";
import { API_GOOGLE_KEY } from "@env";

type Props = {
  setCurrentAddress: any;
  setLocation: any;
  goToMyLocation: any;
};

export default function SearchBar({
  setCurrentAddress,
  setLocation,
  goToMyLocation,
}: Props) {
  const [search, setSearch] = useState<any>([]);
  const searchLocation = () => {
    setLocation({
      latitude: search[0].geometry?.location.lat,
      longitude: search[0].geometry?.location.lng,
    });
    setCurrentAddress(search[0].formatted_address);
    goToMyLocation;
  };

  console.log(search);
  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <GooglePlacesAutocomplete
          placeholder="Search post codes or street names"
          onPress={(data, details) => {
            // 'details' is provided when fetchDetails = true
            setSearch([details]);
            searchLocation;
          }}
          query={{
            key: API_GOOGLE_KEY,
            //components: "country:uk",
            language: "en",
          }}
          fetchDetails={true}
          // currentLocation={true}
          // currentLocationLabel="Current location"
          styles={{
            textInputContainer: {
              borderWidth: 2,
              borderColor: colors.primary,
              width: "100%",
              paddingLeft: 10,
              paddingRight: 60,
              backgroundColor: colors.white,
              borderRadius: 23,
              alignItems: "center",
              shadowColor: "#000",
              flex: 1,
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
            },
            textInput: {
              color: "#5d5d5d",
              fontSize: 16,
              height: 40,
              paddingTop: 8,
              borderRadius: 23,
            },
            predefinedPlacesDescription: {
              color: "#1faadb",
            },
          }}
        />
        <TouchableOpacity style={styles.search} onPress={searchLocation}>
          <Text>Search</Text>
        </TouchableOpacity>
        {/* <TextInput
          onChangeText={setSearch}
          value={search}
          placeholder=""
          placeholderTextColor={colors.primary}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingRight: 15,
    paddingLeft: 15,
    top: 20,
    position: "absolute",
    zIndex: 1,
  },
  input: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
  },
  search: {
    position: "absolute",
    right: 15,
    top: 15,
  },
});
