import React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
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
    borderRadius: 10,
    zIndex: 1,
    right: 15,
    bottom: 15,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  elevation: {
    elevation: 40,
    shadowColor: "#52006A",
  },
});
