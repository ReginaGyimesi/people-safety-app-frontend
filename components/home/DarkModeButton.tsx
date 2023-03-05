import React from "react";
import { StyleSheet, TouchableOpacity, Platform } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import IonIcons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../theme/ThemeProvider";
import { baseColors } from "../../styles/colors";

/**
 * A custom button component to change colour mode.
 */
export default function DarkModeButton() {
  const { colors, setScheme, isDark } = useTheme();

  const changeTheme = () => {
    if (isDark) {
      setScheme("light");
    } else {
      setScheme("dark");
    }
  };

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        ...styles.elevation,
        backgroundColor: colors.background,
        bottom: Platform.OS === "ios" ? "41%" : "40%",
      }}
      onPress={changeTheme}
      testID={"dark-mode-button"}
      accessibilityLabel={"dark-mode-button"}
    >
      {isDark ? (
        <IonIcons name={"sunny-outline"} color={baseColors.primary} size={26} />
      ) : (
        <IonIcons name={"moon-outline"} color={baseColors.primary} size={26} />
      )}
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
