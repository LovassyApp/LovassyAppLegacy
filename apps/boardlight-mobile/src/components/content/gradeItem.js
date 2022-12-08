/* eslint-disable indent */
import { Avatar, List, useTheme } from "react-native-paper";

import React from "react";
import { Platform } from "react-native";
import { getOffset } from "../../utils/misc/offsetUtils";

// Disguisting Android fix for more screensizes.

export const GradeItem = (props) => {
  const { grade } = props.data;
  const theme = useTheme();

  const colors = {
    1: "#f44336",
    // orange:
    2: "#ff9800",
    // yellow
    3: "#ffeb3b",
    // light green
    4: "#8bc34a",
    // dark green
    5: "#4caf50",
  };

  return (
    <List.Item
      title={props.data.type}
      description={props.data.name}
      onPress={props.onPress}
      left={(props) => (
        <Avatar.Text
          {...props}
          style={{
            backgroundColor: colors[grade],
            margin: 8,
          }}
          labelStyle={
            Platform.OS !== "ios"
              ? {
                  flex: 1,
                  flexDirection: "column",
                  alignSelf: "center",
                  marginTop: getOffset(10.25),
                }
              : {}
          }
          size={42}
          color="#000000"
          label={grade === 0 ? "-" : grade}
        />
      )}
      descriptionNumberOfLines={1}
      style={
        props.minimal
          ? {
              padding: 0,
              // Because of adaptive mode in the default dark theme of react native paper
              backgroundColor: theme.dark ? "#1e1e1e" : theme.colors.surface,
              borderRadius: theme.roundness,
              height: 56,
            }
          : {
              padding: 0,
              // Because of adaptive mode in the default dark theme of react native paper
              backgroundColor: theme.dark ? "#1e1e1e" : theme.colors.surface,
              borderRadius: theme.roundness,
              elevation: 1,
              shadowRadius: 0.75,
              shadowOpacity: 0.24,
              shadowOffset: {
                width: 0,
                height: 0.75,
              },
              height: 56,
            }
      }
    />
  );
};
