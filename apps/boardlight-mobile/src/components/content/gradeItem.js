/* eslint-disable indent */
import { Avatar, Caption, List, Subheading, Text, Title, useTheme } from "react-native-paper";
import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

import BottomSheet from "../bottomSheet";

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

  const bottomSheetRef = useRef();

  const styles = StyleSheet.create({
    sheetContainer: {
      flex: 1,
      padding: 20,
    },
    dataContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    title: {
      paddingTop: 8,
    },
    subTitle: {
      paddingBottom: 8,
    },
  });

  return (
    <>
      <BottomSheet
        backgroundColor={theme.colors.backdrop}
        sheetBackgroundColor={theme.dark ? "#1e1e1e" : theme.colors.surface}
        radius={theme.roundness}
        ref={bottomSheetRef}
        height={220}>
        <View style={styles.sheetContainer}>
          <View style={styles.dataContainer}>
            <View style={{ width: "80%" }}>
              <Title style={styles.title} numberOfLines={1}>
                {props.data.type}
              </Title>
              <Text style={styles.subTitle} numberOfLines={1}>
                {props.data.name}
              </Text>
            </View>
            <Avatar.Text
              {...props}
              style={{ backgroundColor: colors[grade], margin: 8 }}
              size={56}
              color="#000000"
              label={grade}
            />
          </View>
          <View style={{ ...styles.dataContainer, paddingTop: 4 }}>
            <Text>Subject:</Text>
            <Text>{props.data.subject}</Text>
          </View>
          <View style={styles.dataContainer}>
            <Text>Teacher:</Text>
            <Text>{props.data.teacher}</Text>
          </View>
          <View style={styles.dataContainer}>
            <Text>Date:</Text>
            <Text>
              {
                // Budget inline formatting let's go
                props.data.date
                  .replace("-", ". ")
                  .replace("-", ". ")
                  .replace("T", ". ")
                  .replace("Z", "")
              }
            </Text>
          </View>
          <View style={styles.dataContainer}>
            <Text>Weight:</Text>
            <Text>{props.data.weight}%</Text>
          </View>
        </View>
      </BottomSheet>
      <List.Item
        title={props.data.type}
        description={props.data.name}
        onPress={() => bottomSheetRef.current.show()}
        left={(props) => (
          <Avatar.Text
            {...props}
            style={{ backgroundColor: colors[grade], margin: 8 }}
            size={40}
            color="#000000"
            label={grade}
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
    </>
  );
};
