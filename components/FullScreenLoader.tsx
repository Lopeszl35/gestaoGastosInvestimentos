import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

type Props = {
  visible?: boolean;
  text?: string;
};

export default function FullScreenLoader({ visible = true, text }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00C853" />
      {!!text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    marginTop: 16,
    fontWeight: "600",
  },
});
