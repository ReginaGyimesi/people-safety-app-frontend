import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { baseColors } from "../../styles/colors";
import { useTheme } from "../../theme/ThemeProvider";

type Props = {
  onPress: () => void;
};

/**
 * A custom button component to return to current location.
 *
 * @param onPress
 */
export default function CurrentLocationButton({ onPress }: Props) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        ...styles.elevation,
        backgroundColor: colors.background,
      }}
      onPress={onPress}
    >
      <MaterialIcons
        name={"my-location"}
        color={baseColors.primary}
        size={26}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 50,
    height: 50,
    borderRadius: 16,
    right: 15,
    bottom: "32%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: "white",
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
