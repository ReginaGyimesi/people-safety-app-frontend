import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, sizes } from "../../styles";
import Handle from "./CustomHandle";

type Props = {
  address: string;
  la: any;
};

export default function CustomBottomSheet({ address, la }: Props) {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["30%", "86%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      //onChange={handleSheetChanges}
      style={styles.sheet}
      handleComponent={Handle}
      //animationConfigs={animationConfigs}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Crime rate in</Text>
        <Text style={styles.text}>{address}</Text>
        <Text style={styles.body}>
          Annual crime rate in your local area is{" "}
          <Text style={{ fontWeight: "bold" }}>{la[0]?.value} per 10000</Text>{" "}
          population. This can be rated as {la[0]?.score} out of 10 or average
          crime level.
        </Text>
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
  },
  container: {
    flex: 1,
    paddingTop: 10,
    padding: 20,
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
  body: {
    fontSize: sizes.S14,
    fontWeight: "500",
    marginTop: 15,
    color: "rgba(99, 99, 99, 1)",
  },
});
