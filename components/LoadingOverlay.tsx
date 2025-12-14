import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#00C853" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
