import { Headline, Text, Title } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import { LaButton } from "../../components/content/customized/laButton";
import React from "react";
import { ScreenContainer } from "../../components/screenContainer";

export const ContributoprsScreen = ({ navigation }) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      flex: 1,
    },
  });

  return (
    <ScreenContainer>
      <Headline>Fejlesztők</Headline>
      <View style={styles.container}>
        <Title style={{ textAlign: "center" }}>Gyimesi Máté</Title>
        <Title style={{ textAlign: "center" }}>Ocskó Nándor</Title>
      </View>
      <LaButton
        dense={true}
        customStyle={{ margin: 10 }}
        onPress={() => navigation.navigate("Kezdőlap")}>
        Vissza
      </LaButton>
    </ScreenContainer>
  );
};
