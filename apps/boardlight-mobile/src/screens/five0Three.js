import { Caption, Headline, Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export const Five0Three = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
  });

  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Ionicons name="close-circle" color="#d32f2f" size={100} />
        <Headline style={{ fontWeight: "bold" }}>503 - Szerverhiba!</Headline>
        <Text>Úgy tűnik, az applikáció jelenleg nem elérhető.</Text>
        <Text>Kérlek próbáld újra később.</Text>
        <Caption>(Amikor újra elérhető lesz, automatikusan átirányítunk)</Caption>
      </View>
    </SafeAreaView>
  );
};
