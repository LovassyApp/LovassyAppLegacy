/* eslint-disable indent */
import { Avatar, List, Surface, Text, Title, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import { BlueboardLoloReason } from "blueboard-client";
import BottomSheet from "../bottomSheet";
import { GradeItem } from "./gradeItem";
import React from "react";

export const LoloCoin = (props) => {
  const theme = useTheme();

  const bottomSheetRef = React.useRef();

  const { isSpent } = props.data;

  const styles = StyleSheet.create({
    sheetContainer: {
      flex: 1,
      padding: 20,
    },
  });

  const getGrades = () => {
    return props.data.grades.map((grade) => (
      <GradeItem data={grade} key={grade.id} minimal={true} />
    ));
  };

  // Must include the bottom sheet here instead of the home screen, because otherwise the height will be off no matter what
  return (
    <>
      <BottomSheet
        backgroundColor={theme.colors.backdrop}
        sheetBackgroundColor={theme.dark ? "#1e1e1e" : theme.colors.surface}
        radius={theme.roundness}
        ref={bottomSheetRef}
        height={props.data.grades.length * 56 + 112}>
        <View style={styles.sheetContainer}>
          <Title>Jegyek</Title>
          {getGrades()}
        </View>
      </BottomSheet>
      <List.Item
        title={
          props.data.reason === BlueboardLoloReason.FromFive
            ? "Ötösökből generálva"
            : props.data.reason === BlueboardLoloReason.FromFour
            ? "Négyesekből generálva"
            : "Kérelemből"
        }
        description={props.data.isSpent ? "Elköltve" : "Elérhető"}
        left={(props) => (
          <Avatar.Icon
            {...props}
            size={40}
            icon="server"
            color={isSpent ? theme.colors.disabled : theme.colors.primary}
            style={{ backgroundColor: "transparent", margin: 8 }}
          />
        )}
        onPress={() =>
          props.data.reason !== BlueboardLoloReason.FromRequest && bottomSheetRef.current.show()
        }
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
