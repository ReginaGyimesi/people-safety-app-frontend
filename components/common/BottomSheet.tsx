import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, sizes } from "../../styles";
import Handle from "./CustomHandle";

type Props = {
  address: string;
};

export default function CustomBottomSheet({ address }: Props) {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["20%", "86%"], []);

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
});
