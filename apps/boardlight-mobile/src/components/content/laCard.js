import { Button, Surface, Text, Title, useTheme } from "react-native-paper";
import { Pressable, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import React from "react";

export const LaCard = (props) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      borderRadius: theme.roundness,
      elevation: 1,
      padding: 10,
      marginVertical: 5,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });

  if (props.error) {
    return (
      <Surface style={styles.container}>
        <View style={styles.topRow}>
          <Title>{props.title}</Title>
        </View>
        <Text style={{ alignSelf: "center", margin: 25 }}>Az adatok lekérése sikertelen</Text>
        <Button onPress={() => props.retry()}>Próbáld újra</Button>
      </Surface>
    );
  }

  if (props.actionIcon) {
    return (
      <Surface style={styles.container}>
        <View style={styles.topRow}>
          <Title>{props.title}</Title>
          <Pressable onPress={props.onPress}>
            <Ionicons name={props.actionIcon} size={24} color={theme.colors.text} />
          </Pressable>
        </View>
        {props.children}
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <Title>{props.title}</Title>
      {props.children}
    </Surface>
  );
};
