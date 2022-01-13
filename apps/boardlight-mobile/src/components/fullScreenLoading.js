import { ActivityIndicator, useTheme } from "react-native-paper";
import { Modal, StyleSheet } from "react-native";

import React from "react";

export const FullScreenLoading = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
    },
  });

  return (
    <Modal style={styles.container}>
      <ActivityIndicator
        size="large"
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      />
    </Modal>
  );
};
