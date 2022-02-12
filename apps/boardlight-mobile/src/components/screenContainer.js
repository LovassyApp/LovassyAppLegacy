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
      marginBottom: Platform.OS === "android" ? insets.bottom - 25 : null,
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
    <SafeAreaView style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.container} {...props}>
        {props.children}
      </View>
    </SafeAreaView>
  );
};
