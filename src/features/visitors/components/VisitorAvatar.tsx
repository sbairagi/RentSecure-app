import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface VisitorAvatarProps {
  name: string;
  size?: number;
  backgroundColor?: string;
}

export const VisitorAvatar: React.FC<VisitorAvatarProps> = ({
  name,
  size = 44,
  backgroundColor = "#e5e7eb",
}) => {
  const initial = name.charAt(0).toUpperCase();
  const fontSize = size * 0.4;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initial}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "700",
    color: "#374151",
  },
});
