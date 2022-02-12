/* eslint-disable indent */
import { Avatar, List, Surface, Text, useTheme } from "react-native-paper";

import { BlueboardLoloReason } from "blueboard-client";
import React from "react";

export const LoloCoin = (props) => {
  const theme = useTheme();
  const { isSpent } = props.coin;

  return (
    <List.Item
      title={
        props.coin.reason === BlueboardLoloReason.FromFive
          ? "Ötösökből generálva"
          : props.coin.reason === BlueboardLoloReason.FromFour
          ? "Négyesökből generálva"
          : "Kérelemből"
      }
      description={props.coin.isSpent ? "Elköltve" : "Elérhető"}
      left={(props) => (
        <Avatar.Icon
          {...props}
          size={40}
          icon="cash"
          color={isSpent ? theme.colors.disabled : theme.colors.primary}
          style={{ backgroundColor: "transparent", margin: 8 }}
        />
      )}
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
