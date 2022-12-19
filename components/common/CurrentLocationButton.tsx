import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { colors } from "../../styles";

type Props = {
  onPress: () => void;
};

export default function CurrentLocationButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, styles.elevation]}
      onPress={onPress}
    >
      <MaterialIcons name={"my-location"} color={colors.primary} size={26} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: 50,
    height: 50,
    borderRadius: 16,
    right: 15,
    bottom: "20%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  elevation: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
});
