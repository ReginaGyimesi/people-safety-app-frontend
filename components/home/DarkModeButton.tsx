import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import IonIcons from "react-native-vector-icons/Ionicons";
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
      }}
      onPress={changeTheme}
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
    bottom: "41%",
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
