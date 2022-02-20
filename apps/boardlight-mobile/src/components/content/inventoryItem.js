/* eslint-disable newline-per-chained-call */
/* eslint-disable indent */
import { Chip, Text, useTheme } from "react-native-paper";
import { Image, Platform, TouchableWithoutFeedback, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import React from "react";

export const InventoryItem = (props) => {
  const theme = useTheme();

  const { product } = props.data;

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
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
                marginVertical: 5,
                marginBottom: props.last && Platform.OS === "ios" ? 40 : 5,
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
                marginVertical: 5,
                marginBottom: props.last && Platform.OS === "ios" ? 40 : 5,
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
            style={{
              fontSize: 16,
              color: theme.dark ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 0, 0, 0.87)",
            }}>
            {product.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              color: theme.dark ? "rgba(255, 255, 255, 0.54)" : "rgba(0, 0, 0, 0.54)",
            }}>
            {product.description}
          </Text>
          <Chip
            textStyle={{
              color: "#ffffff",
            }}
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
          color={theme.dark ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 0, 0, 0.87)"}
          name="chevron-forward"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
