import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function VisitorEntryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Visitor Entry Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  text: {
    fontSize: 16,
    color: "#6b7280",
  },
});
