import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, sizes } from "../../styles";
import { baseColors } from "../../styles/colors";
import Handle from "./CustomHandle";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import { useTheme } from "../../theme/ThemeProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackActions, useNavigation } from "@react-navigation/native";

type Props = {
  address: string;
  data: any;
  message: string;
  isLoading: boolean;
  neighbours: any;
  onNeighbourClick: any;
};

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const { colors } = useTheme();

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      [colors.background, colors.background]
    ),
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

/**
 * A custom bottom sheet component.
 * @see https://gorhom.github.io/react-native-bottom-sheet/
 *
 * @param address
 * @param data
 * @param message
 * @param isLoading
 * @param neighbours
 * @param onNeighbourClick
 */
export default function CustomBottomSheet({
  address,
  data,
  message,
  isLoading,
  neighbours,
  onNeighbourClick,
}: Props) {
  const { colors } = useTheme();
  // bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();

  // bottom sheet snap points
  const snapPoints = useMemo(() => ["30%", "86%"], []);
  const snapPointsNone = useMemo(() => ["30%"], []);

  // select color of danger based on danger level
  const selectColor = (scoreCat: string) => {
    if (scoreCat === "high") {
      return baseColors.dangerRed;
    } else if (scoreCat == "average") {
      return baseColors.orange;
    } else if (scoreCat == "low") {
      return baseColors.acceptGreen;
    }
  };

  if (!data) return <></>;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleComponent={Handle}
      style={{ ...styles.sheet }}
      backgroundComponent={CustomBackground}
    >
      <View
        style={{
          paddingRight: 20,
          paddingLeft: 20,
          borderBottomLeftRadius: 23,
          paddingBottom: 30,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...styles.heading,
              color: colors.text,
              marginRight: 10,
            }}
          >
            Crime rate in
          </Text>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => navigation.dispatch(StackActions.push("Stats"))}
          >
            <Text style={{ color: baseColors.white }}>More stats</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ ...styles.text, maxWidth: 280 }}>{address}</Text>
      </View>
      <BottomSheetScrollView bounces={true}>
        {isLoading ? (
          <ActivityIndicator style={{ paddingTop: 10 }} />
        ) : (
          <>
            {message ? (
              <>
                <Text
                  style={[
                    styles.body,
                    styles.bold,
                    {
                      color: colors.secondaryText,
                      paddingLeft: 20,
                      paddingRight: 20,
                    },
                  ]}
                >
                  {message}
                </Text>
              </>
            ) : (
              <View
                style={{
                  backgroundColor: "rgba(0, 166, 153, 0.25)",
                  zIndex: -1,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    ...styles.section,
                    backgroundColor: colors.background,
                    borderLeftWidth: 4,
                    borderColor: selectColor(data[0]?.score_category),
                  }}
                >
                  {!message && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={[
                          styles.circle,
                          {
                            backgroundColor: selectColor(
                              data[0]?.score_category
                            ),
                          },
                        ]}
                      ></View>
                    </View>
                  )}

                  <>
                    <Text
                      style={[
                        styles.subtitle,
                        { marginLeft: 22, color: colors.text, marginTop: -17 },
                      ]}
                    >
                      {data[0]?.score_category}
                    </Text>
                    <Text
                      style={{ ...styles.body, color: colors.secondaryText }}
                    >
                      Annual crime rate in your local area is{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {data[0]?.total_crime}
                      </Text>{" "}
                      per 10 000 population. This can be rated as{" "}
                      {data[0]?.score} out of 10 or {data[0]?.score_category}{" "}
                      crime level.
                    </Text>
                  </>
                </View>
                {!message && (
                  <>
                    <View
                      style={{
                        ...styles.section,
                        backgroundColor: colors.background,
                      }}
                    >
                      <Text style={[styles.subtitle, { color: colors.text }]}>
                        Most common crime types
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View>
                          {data[0]?.crime_type?.map((c: any, i: any) => (
                            <Text
                              key={i}
                              style={{
                                ...styles.body,
                                color: colors.secondaryText,
                              }}
                            >
                              {c}
                            </Text>
                          ))}
                        </View>
                        <View>
                          {data[0]?.n?.map((c: any, i: any) => (
                            <Text
                              key={i}
                              style={[
                                styles.body,
                                {
                                  fontWeight: "700",
                                  color: colors.secondaryText,
                                },
                              ]}
                            >
                              {c}
                            </Text>
                          ))}
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        ...styles.section,
                        backgroundColor: colors.background,
                        borderBottomLeftRadius: 0,
                      }}
                    >
                      <Text style={[styles.subtitle, { color: colors.text }]}>
                        Neighbouring areas
                      </Text>
                      {neighbours &&
                        neighbours[0]?.neighbour?.map((n: any, i: number) => (
                          <Text
                            key={i}
                            style={[
                              styles.body,
                              {
                                fontWeight: "400",
                                color: baseColors.primary,
                                textDecorationLine: "underline",
                                marginTop: 7,
                              },
                            ]}
                            onPress={() => onNeighbourClick(i)}
                          >
                            {n}
                          </Text>
                        ))}
                    </View>
                  </>
                )}
              </View>
            )}
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    paddingTop: 10,
    paddingBottom: 10,
    overflow: "hidden",
  },
  heading: {
    fontSize: sizes.XL24,
    fontWeight: "800",
  },
  text: {
    fontSize: sizes.ML18,
    fontWeight: "600",
    marginTop: 5,
    color: baseColors.primary,
  },
  subtitle: {
    fontSize: sizes.M16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  body: {
    fontSize: sizes.S14,
    fontWeight: "400",
    marginTop: 5,
  },
  bold: {
    fontWeight: "700",
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 16 / 2,
    backgroundColor: "black",
    marginRight: 5,
  },
  button: {
    display: "flex",
    alignItems: "center",
    borderWidth: 2,
    borderColor: baseColors.primary,
    borderRadius: 23,
    width: 100,
    padding: 5,
    backgroundColor: baseColors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  section: {
    backgroundColor: "white",
    marginTop: 8,
    borderTopLeftRadius: 23,
    borderBottomLeftRadius: 23,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
});
