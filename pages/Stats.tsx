import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart, BarChart, ProgressChart } from "react-native-chart-kit";
import GoBackButton from "../components/common/GoBackButton";
import { sizes } from "../styles";
import { baseColors } from "../styles/colors";
import { useTheme } from "../theme/ThemeProvider";

const screenWidth = Dimensions.get("window").width;

export default function StatsScreen() {
  const { colors } = useTheme();

  // src: https://gist.github.com/MaurilioNovais/666b9e69e123107393c242136dfc62e6
  const [progressTime, setProgressTime] = useState(0);

  // Define a initial value for chart
  const animationValue = useRef(new Animated.Value(0)).current;

  console.log(screenWidth - 20);
  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: colors.background,
    backgroundGradientToOpacity: 0.5,

    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => baseColors.primary,
    labelColor: (opacity = 1) => colors.secondaryText,
    strokeWidth: 2,

    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  useEffect(() => {
    // Define animation for chart
    Animated.timing(animationValue, {
      toValue: 0.65, // Value to graph
      duration: 1000, // Duration for animation
      useNativeDriver: false,
    }).start();

    // Listen the animation variable and update chart variable
    animationValue.addListener(({ value }) => {
      console.log("🚀 ~ animationValue.addListener ~ value", value);
      setProgressTime(value);
    });
  }, []);
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
      <View style={{ marginTop: 30 }}>
        <BarChart
          data={data}
          width={screenWidth - 30}
          height={200}
          chartConfig={chartConfig}
        />
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
