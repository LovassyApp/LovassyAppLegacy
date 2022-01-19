import { Avatar, List, useTheme } from "react-native-paper";

import React from "react";
import { lightTheme } from "../../utils/theme/themes";
import { useSelector } from "react-redux";

export const GradeItem = (props) => {
  const { grade } = props.data;
  const theme = useTheme();
  const reduxTheme = useSelector((state) => state.theme.value);

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

  // TODO: On click bottom sheet

  return (
    <List.Item
      title={props.data.type}
      description={props.data.name}
      left={(props) => (
        <Avatar.Text
          {...props}
          style={{ backgroundColor: colors[grade], margin: 8 }}
          size={40}
          color="#000000"
          label={grade}
        />
      )}
      style={{
        padding: 0,
        // Because of adaptive mode in the default dark theme of react native paper
        backgroundColor: reduxTheme === lightTheme ? theme.colors.surface : "#1e1e1e",
        borderRadius: theme.roundness,
        elevation: 1,
        shadowRadius: 0.75,
        shadowOpacity: 0.24,
        shadowOffset: {
          width: 0,
          height: 0.75,
        },
        height: 56,
      }}
    />
  );
};
