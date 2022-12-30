import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, sizes } from "../../styles";
import Handle from "./CustomHandle";

type Props = {
  address: string;
  data: any;
  message: string;
};

export default function CustomBottomSheet({ address, data, message }: Props) {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["30%", "86%"], []);
  const snapPointsNone = useMemo(() => ["30%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const selectColor = (scoreCat: string) => {
    if (scoreCat === "high") {
      return "#BD2031";
    } else if (scoreCat == "average") {
      return "rgba(252, 100, 45, 0.8)";
    } else if (scoreCat == "low") {
      return "#228b22";
    }
  };

  // renders
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={message ? snapPointsNone : snapPoints}
      //onChange={handleSheetChanges}
      style={styles.sheet}
      handleComponent={Handle}
      //animationConfigs={animationConfigs}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Crime rate in</Text>
        <Text style={styles.text}>{address}</Text>
        <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
          {!message && (
            <View
              style={[
                styles.circle,
                { backgroundColor: selectColor(data[0]?.score_category) },
              ]}
            ></View>
          )}
          <View>
            {message ? (
              <Text style={[styles.body, styles.bold]}>{message}</Text>
            ) : (
              <>
                <Text style={styles.subtitle}>{data[0]?.score_category}</Text>
                <Text style={styles.body}>
                  Annual crime rate in your local area is{" "}
                  <Text style={{ fontWeight: "bold" }}>{data[0]?.value}</Text>{" "}
                  per 10 000 population. This can be rated as {data[0]?.score}{" "}
                  out of 10 or {data[0]?.score_category} crime level.
                </Text>
              </>
            )}
          </View>
        </View>
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
    paddingLeft: 20,
  },
  container: {
    flex: 1,
    paddingRight: 40,
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
    fontWeight: "500",
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
    width: 17,
    height: 17,
    borderRadius: 17 / 2,
    backgroundColor: "black",
    marginRight: 5,
  },
});
