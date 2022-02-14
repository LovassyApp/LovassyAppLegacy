import { Headline, Text } from "react-native-paper";

import React from "react";
import { ScreenContainer } from "../../components/screenContainer";

export const ConfirmScreen = ({ route }) => {
  const item = route.params;

  return (
    <ScreenContainer>
      <Headline>Felhasználók</Headline>
      <Text>{item.product.name}</Text>
    </ScreenContainer>
  );
};
