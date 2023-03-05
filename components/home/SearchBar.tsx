import { API_GOOGLE_KEY } from "@env";
import React from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { baseColors } from "../../styles/colors";
import { useTheme } from "../../theme/ThemeProvider";
import { filterCountry, filterLa, filterPostCode } from "../../utils/common";

type Props = {
  searchLocation: any;
};

/**
 * A custom search bar component to search areas.
 *
 * @param searchLocation
 */
export default function SearchBar({ searchLocation }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <GooglePlacesAutocomplete
          placeholder="Start typing area names, streets..."
          textInputProps={{
            placeholderTextColor: colors.placeholder,
          }}
          onPress={(_, details) => {
            // 'details' is provided when fetchDetails = true
            searchLocation({
              country: filterCountry(details),
              localAuth: filterLa(details),
              postcode: filterPostCode(details)?.short_name,
              lat: details?.geometry.location.lat,
              lng: details?.geometry.location.lng,
              details: details,
            });
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
              borderColor: baseColors.primary,
              width: "100%",
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: colors.background,
              borderRadius: 23,
              alignItems: "center",
              flex: 1,
              shadowColor: "black",
              shadowOpacity: 0.26,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 10,
              elevation: 20,
            },
            textInput: {
              color: colors.secondaryText,
              fontSize: 16,
              height: 40,
              paddingTop: 8,
              borderRadius: 23,
              backgroundColor: colors.background,
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
