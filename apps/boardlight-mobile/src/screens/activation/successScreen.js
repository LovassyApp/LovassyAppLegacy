import { Headline, Subheading } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { ScreenContainer } from "../../components/screenContainer";
import { View } from "react-native";
import { LaButton } from "../../components/content/customized/laButton";
import { Ionicons } from "@expo/vector-icons";

export const SuccessScreen = ({ navigation, route }) => {
  const item = route.params;

  const [time, setTime] = useState(90);

  // useEffect(() => {
  //   setTime(90);
  // }, []);

  useEffect(() => {
    if (time === 0) {
      navigation.navigate("Kezdőlap");
    }

    const interval = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <ScreenContainer>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Ionicons name="checkmark-circle" color="#2e7d32" size={100} />
        <Headline>Sikeres beváltás!</Headline>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 10,
          }}>
          <Subheading>Termék:</Subheading>
          <Subheading numberOfLines={1}>{item.product.name}</Subheading>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
          <Subheading>Azonosító:</Subheading>
          <Subheading numberOfLines={1}>{item.id}</Subheading>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
          <Subheading>Hátralévő idő az oldalon:</Subheading>
          <Subheading numberOfLines={1}>{time}s</Subheading>
        </View>
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
