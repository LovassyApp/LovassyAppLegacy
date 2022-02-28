import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import React from "react";
import { useTheme } from "react-native-paper";

export const ScreenContainer = (props) => {
  const theme = useTheme();

  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      margin: 10,
      height: "100%",
      paddingBottom: Platform.OS === "android" ? insets.bottom + 25 : 0,
    },
  });

  if (props.scrollable) {
    return (
      <SafeAreaView
        edges={["top", "left", "right", "bottom"]}
        style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>{props.children}</ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.container}>{props.children}</View>
    </SafeAreaView>
  );
};
