import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function Loading() {
  return <ActivityIndicator style={styles.loading} />;
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
