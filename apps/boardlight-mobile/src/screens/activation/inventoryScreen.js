import { Headline } from "react-native-paper";
import { InventoryItem } from "../../components/content/inventoryItem";
import React from "react";
import { ScreenContainer } from "../../components/screenContainer";
import { useSelector } from "react-redux";

export const InventoryScreen = () => {
  const inventory = useSelector((state) => state.inventory.value);

  return (
    <ScreenContainer scrollable={true}>
      <Headline>Kincstár</Headline>
      <InventoryItem data={inventory[0]} />
    </ScreenContainer>
  );
};
