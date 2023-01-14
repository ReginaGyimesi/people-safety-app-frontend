import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, sizes } from "../../styles";
import Handle from "./CustomHandle";

type Props = {
  address: string;
  data: any;
  message: string;
  isLoading: boolean;
};

/**
 * A custom bottom sheet component.
 * @see https://gorhom.github.io/react-native-bottom-sheet/
 *
 * @param address
 * @param data
 * @param message
 * @param isLoading
 */
export default function CustomBottomSheet({
  address,
  data,
  message,
  isLoading,
}: Props) {
  // bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // bottom sheet snap points
  const snapPoints = useMemo(() => ["30%", "86%"], []);
  const snapPointsNone = useMemo(() => ["30%"], []);

  // select color of danger based on danger level
  const selectColor = (scoreCat: string) => {
    if (scoreCat === "high") {
      return colors.dangerRed;
    } else if (scoreCat == "average") {
      return colors.orange;
    } else if (scoreCat == "low") {
      return colors.acceptGreen;
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={message ? snapPointsNone : snapPoints}
      style={styles.sheet}
      handleComponent={Handle}
    >
      <View>
        <Text style={styles.heading}>Crime rate in</Text>
        <Text style={styles.text}>{address}</Text>
        {isLoading ? (
          <ActivityIndicator style={{ paddingTop: 10 }} />
        ) : (
          <View style={{ marginTop: 20 }}>
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
                    { backgroundColor: selectColor(data[0]?.score_category) },
                  ]}
                ></View>
              </View>
            )}

            {message ? (
              <>
                <Text style={[styles.body, styles.bold]}>{message}</Text>
              </>
            ) : (
              <>
                <Text style={[styles.subtitle, { marginLeft: 22 }]}>
                  {data[0]?.score_category}
                </Text>
                <Text style={styles.body}>
                  Annual crime rate in your local area is{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {data[0]?.total_crime}
                  </Text>{" "}
                  per 10 000 population. This can be rated as {data[0]?.score}{" "}
                  out of 10 or {data[0]?.score_category} crime level.
                </Text>
              </>
            )}
            {!message && (
              <View>
                <Text style={[styles.subtitle, { marginTop: 20 }]}>
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
                      <Text key={i} style={styles.body}>
                        {c}
                      </Text>
                    ))}
                  </View>
                  <View>
                    {data[0]?.n?.map((c: any, i: any) => (
                      <Text
                        key={i}
                        style={[styles.body, { fontWeight: "700" }]}
                      >
                        {c}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
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
    paddingLeft: 20,
    paddingRight: 20,
  },
  heading: {
    fontSize: sizes.XL24,
    fontWeight: "800",
  },
  text: {
    fontSize: sizes.ML18,
    fontWeight: "600",
    marginTop: 5,
    color: colors.primary,
  },
  subtitle: {
    fontSize: sizes.M16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  body: {
    fontSize: sizes.S14,
    fontWeight: "500",
    marginTop: 5,
    color: "rgba(99, 99, 99, 1)",
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
});
