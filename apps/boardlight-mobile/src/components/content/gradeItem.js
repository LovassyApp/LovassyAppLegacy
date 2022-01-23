import { Avatar, Caption, List, Subheading, Text, Title, useTheme } from "react-native-paper";
import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

import BottomSheet from "react-native-gesture-bottom-sheet";
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
        backgroundColor={reduxTheme === lightTheme ? "#25252599" : "#00000099"}
        sheetBackgroundColor={reduxTheme === lightTheme ? theme.colors.surface : "#1e1e1e"}
        radius={theme.roundness}
        ref={bottomSheetRef}
        height={220}>
        <View style={styles.sheetContainer}>
          <View style={styles.dataContainer}>
            <View>
              <Title style={styles.title}>{props.data.type}</Title>
              <Text style={styles.subTitle}>{props.data.name}</Text>
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
    </>
  );
};
