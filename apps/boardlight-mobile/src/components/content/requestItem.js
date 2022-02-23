/* eslint-disable indent */
import React from "react";
import { Avatar, Chip, List, Text, useTheme } from "react-native-paper";
import { View, Platform } from "react-native";

export const RequestItem = (props) => {
  const theme = useTheme();

  console.log(props.data);

  const getColor = () => {
    if (props.data.acceptedAt) {
      return "#2e7d32";
    } else if (props.data.deniedAt) {
      return "#b71c1c";
    }

    return "#f9a825";
  };

  return (
    <View
      style={
        props.minimal
          ? {
              padding: 0,
              // Because of adaptive mode in the default dark theme of react native paper
              backgroundColor: theme.dark ? "#1e1e1e" : theme.colors.surface,
              borderRadius: theme.roundness,
              height: 56,
              flexDirection: "row",
              marginVertical: 5,
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
              flexDirection: "row",
              marginVertical: 5,
            }
      }>
      <Avatar.Icon
        {...props}
        icon="mail"
        color={theme.colors.primary}
        size={40}
        style={{ backgroundColor: "transparent", margin: 8, alignSelf: "center" }}
      />
      <View style={{ width: "50%", padding: 10 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 16,
            color: theme.dark ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 0, 0, 0.87)",
          }}>
          {props.data.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 14,
            color: theme.dark ? "rgba(255, 255, 255, 0.54)" : "rgba(0, 0, 0, 0.54)",
          }}>
          {props.data.body}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-end",
        }}>
        <Chip
          textStyle={{
            color: "#ffffff",
          }}
          style={{
            backgroundColor: getColor(),
            marginTop: 5,
            alignSelf: "center",
            height: 32,

            alignItems: "center",
          }}>
          {props.data.acceptedAt && "Elfogadva"}
          {props.data.deniedAt && "Elutasítva"}
          {!props.data.acceptedAt && !props.data.deniedAt && "Függőben"}
        </Chip>
      </View>
    </View>
  );
};
