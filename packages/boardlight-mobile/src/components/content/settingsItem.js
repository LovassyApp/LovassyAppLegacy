import { Pressable, StyleSheet } from "react-native";
import { Subheading, Surface, Text, useTheme } from "react-native-paper";

import React from "react";

export const SettingsItem = (props) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: props.dense ? 40 : 56,
      width: "100%",
      borderRadius: theme.roundness,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      elevation: 1,
      padding: 10,
      marginVertical: 5,
    },
    pressable: {
      width: "100%",
      borderRadius: theme.roundness,
    },
  });

  if (props.onPress) {
    return (
      <Pressable onPress={props.onPress} style={styles.pressable}>
        <Surface style={styles.container}>
          {props.dense ? <Text>{props.title}</Text> : <Subheading>{props.title}</Subheading>}
          {props.right}
        </Surface>
      </Pressable>
    );
  }

  return (
    <Surface style={styles.container}>
      {props.dense ? <Text>{props.title}</Text> : <Subheading>{props.title}</Subheading>}
      {props.right}
    </Surface>
  );
};
