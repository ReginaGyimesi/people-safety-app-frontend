import { API_GOOGLE_KEY } from "@env";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { colors } from "../../styles";

type Props = {
  searchLocation: (details: GooglePlaceDetail | null) => void;
};

/**
 * A custom search bar component to search areas.
 *
 * @param searchLocation
 */
export default function SearchBar({ searchLocation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <GooglePlacesAutocomplete
          placeholder="Search places and postcodes..."
          onPress={(_, details) => {
            // 'details' is provided when fetchDetails = true
            searchLocation(details);
          }}
          query={{
            key: API_GOOGLE_KEY,
            components: "country:uk",
            language: "en",
          }}
          fetchDetails={true}
          styles={{
            textInputContainer: {
              borderWidth: 2,
              borderColor: colors.primary,
              width: "100%",
              paddingLeft: 10,
              paddingRight: 10,
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingRight: 15,
    paddingLeft: 15,
    marginTop: 34,
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
