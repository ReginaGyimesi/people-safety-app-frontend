import { View, Text, StyleSheet } from "react-native";
import GoBackButton from "../components/common/GoBackButton";
import { sizes } from "../styles";
import { useTheme } from "../theme/ThemeProvider";

export default function StatsScreen() {
  const { colors } = useTheme();
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.flex}>
        <GoBackButton />
        <Text
          style={{
            ...styles.heading,
            color: colors.text,
            marginRight: 10,
          }}
        >
          Stats
        </Text>
        <View style={{ width: 60 }}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 34,
    height: "100%",
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: sizes.XL24,
    fontWeight: "800",
  },
});
