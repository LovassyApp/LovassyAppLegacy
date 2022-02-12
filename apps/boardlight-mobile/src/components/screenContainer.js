import { ScrollView, StyleSheet, View } from "react-native";

import React from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";

export const ScreenContainer = (props) => {
  const theme = useTheme();

  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      margin: 10,
      height: "100%",
      marginBottom: insets.bottom - 25,
    },
  });

  if (props.scrollable) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
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
