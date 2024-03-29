import { HelperText, Subheading, Switch, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import { LaInput } from "./content/customized/laInput";
/* eslint-disable indent */
import React from "react";

export const InputRenderer = (props) => {
  const theme = useTheme();

  const getError = (inputName) => {
    const err = props.errors ?? {};

    return err[inputName] ?? "";
  };

  const styles = StyleSheet.create({
    switchContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 5,
      alignItems: "center",
      paddingLeft: 5,
    },
  });

  const renderedInputs = props.inputs.sort((a, b) => {
    return a.type === "boolean" && b.type !== "boolean" ? 1 : 0;
  });

  const state = props.inputState ?? {};

  const getRender = () => {
    return renderedInputs.map((input) => {
      switch (input.type) {
        case "textbox":
          return (
            <View key={input.name}>
              <LaInput
                style={{ marginVertical: 5 }}
                label={input.title}
                value={state[input.name]}
                onChangeText={(text) => {
                  props.onChange(input.name, text);
                }}
                error={getError(input.name) !== ""}
                dense={true}
                blurOnSubmit={true}
                maxLength={255}
              />
              {getError(input.name) !== "" && (
                <HelperText style={{ marginTop: -5, marginBottom: -5 }} type="error">
                  {getError(input.name)}
                </HelperText>
              )}
            </View>
          );
        default:
          return (
            <View key={input.name} style={styles.switchContainer}>
              <Subheading>{input.title}</Subheading>
              <Switch
                color={theme.colors.primary}
                value={state[input.name]}
                onValueChange={(value) => {
                  props.onChange(input.name, value);
                }}
              />
            </View>
          );
      }
    });
  };

  return getRender();
};
