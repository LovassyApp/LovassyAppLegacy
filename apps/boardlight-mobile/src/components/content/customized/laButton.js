import { Button } from "react-native-paper";
import React from "react";
import { StyleSheet } from "react-native";

export const LaButton = (props) => {
  const styles = StyleSheet.create({
    button: {
      height: props.dense ? 40 : 56,
      justifyContent: "center",
      ...props.customStyle,
    },
  });

  return (
    <Button style={styles.button} mode="contained" uppercase={false} {...props}>
      {props.children}
    </Button>
  );
};
