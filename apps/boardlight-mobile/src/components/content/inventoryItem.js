/* eslint-disable newline-per-chained-call */
/* eslint-disable indent */
import { Chip, Headline, IconButton, List, Text, useTheme } from "react-native-paper";
import { Image, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import color from "color";

export const InventoryItem = (props) => {
  const theme = useTheme();
  const { product } = props.data;

  console.log(props.data);

  return (
    <View
      style={
        props.minimal
          ? {
              padding: 0,
              // Because of adaptive mode in the default dark theme of react native paper
              backgroundColor: theme.dark ? "#1e1e1e" : theme.colors.surface,
              borderRadius: theme.roundness,
              height: 106,
              flexDirection: "row",
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
              height: 106,
              flexDirection: "row",
            }
      }>
      <Image
        style={{
          height: 106,
          width: "30%",
          borderTopLeftRadius: theme.roundness,
          borderBottomLeftRadius: theme.roundness,
        }}
        source={{ uri: product.imageUrl }}
      />
      <View style={{ width: "60%", padding: 10 }}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 16, color: color(theme.colors.text).alpha(0.87).rgb().string() }}>
          {product.name}
        </Text>
        <Text
          numberOfLines={1}
          style={{ fontSize: 14, color: color(theme.colors.text).alpha(0.54).rgb().string() }}>
          {product.description}
        </Text>
        <Chip
          style={{
            backgroundColor: props.data.usedAt ? "#d32f2f" : "#2e7d32",
            marginTop: 5,
            alignSelf: "flex-start",
            height: 32,
          }}>
          {props.data.usedAt ? `Felhasználva ${props.data.usedAt}` : "Felhasználható"}
        </Chip>
      </View>
      <Ionicons
        style={{ alignSelf: "center" }}
        size={26}
        color={color(theme.colors.text).alpha(0.87).rgb().string()}
        name="chevron-forward"
      />
    </View>
  );
};
