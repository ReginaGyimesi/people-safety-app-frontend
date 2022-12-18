import React, { useEffect } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { colors } from "../../styles";
import { API_GOOGLE_KEY } from "@env";

export default function SearchBar() {
  const [search, setSearch] = React.useState(null);
  useEffect(() => console.log(search));

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <GooglePlacesAutocomplete
          placeholder="Search post codes or street names"
          query={{ key: API_GOOGLE_KEY, components: "country:hu" }}
          textInputProps={{
            onChangeText: setSearch,
          }}
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
        {/* <TextInput
          onChangeText={setSearch}
          value={search}
          placeholder=""
          placeholderTextColor={colors.primary}
        /> */}
        {!search && (
          <MaterialIcons
            name="search"
            size={20}
            color={colors.primary}
            style={styles.search}
          />
        )}
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
