import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { colors } from "../../styles";

export default function SearchBar() {
  const [search, setSearch] = React.useState("");
  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <TextInput
          onChangeText={setSearch}
          value={search}
          placeholder="Search post codes or street names"
          placeholderTextColor={colors.primary}
        />
        <MaterialIcons name="search" size={20} color={colors.primary} />
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
    height: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: colors.white,
    borderRadius: 23,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: colors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
});
