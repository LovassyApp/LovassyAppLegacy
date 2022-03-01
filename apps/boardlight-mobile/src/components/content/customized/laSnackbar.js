import { Snackbar, useTheme } from "react-native-paper";

import React from "react";

export const LaSnackbar = (props) => {
  const theme = useTheme();

  return (
    <Snackbar
      {...props}
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          surface: theme.colors.text,
          onSurface: theme.dark ? "#171717" : theme.colors.surface,
        },
      }}>
      {props.children}
    </Snackbar>
  );
};
