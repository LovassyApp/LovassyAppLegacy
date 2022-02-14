/* eslint-disable indent */
import { Button, Headline, HelperText, Text, TextInput } from "react-native-paper";

import { InventoryItem } from "../../components/content/inventoryItem";
import { LaInput } from "../../components/content/customized/laInput";
import React from "react";
import { ScreenContainer } from "../../components/screenContainer";
import { View } from "react-native";
import { fetchInventory } from "../../utils/api/apiUtils";
import { matchSorter } from "match-sorter";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../../hooks/useLoading";
import { useSelector } from "react-redux";

export const InventoryScreen = ({ navigation }) => {
  const items = useSelector((state) => state.inventory.value);

  const [query, setQuery] = React.useState("");

  const client = useBlueboardClient();
  const loading = useLoading();

  const getItems = () => {
    return renderedItems?.map((item, key) => (
      <InventoryItem
        last={key === (renderedItems ?? []).length - 1}
        data={item}
        key={item.id}
        onPress={() => navigation.navigate("Megerősítés", item)}
      />
    ));
  };

  const renderedItems =
    query === ""
      ? items
      : matchSorter(items, query, {
          keys: ["product.name", "product.description"],
          threshold: matchSorter.rankings.CONTAINS,
        });

  const tryAgain = async () => {
    loading(true);

    try {
      await fetchInventory(client);
    } catch (err) {
      console.log(err);
    }

    loading(false);
  };

  if (!items) {
    return (
      <ScreenContainer>
        <Headline>Áruház</Headline>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Az adatok lekérése sikertelen</Text>
          <Button onPress={() => tryAgain()}>Próbáld újra</Button>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={true}>
      <Headline>Kincstár</Headline>
      <LaInput
        style={{ marginBottom: 5 }}
        value={query}
        onChangeText={(text) => setQuery(text)}
        dense={true}
        right={
          query !== "" && (
            <TextInput.Icon name="close" onPress={() => setQuery("")} forceTextInputFocus={false} />
          )
        }
        error={renderedItems.length === 0 && items.length !== 0}
        blurOnSubmit={true}
        returnKeyType="search"
        placeholder="Keresés"
      />
      {renderedItems.length === 0 && items.length !== 0 && (
        <HelperText style={{ marginTop: -5 }} type="error">
          Nem található ilyen termék
        </HelperText>
      )}
      {getItems()}
    </ScreenContainer>
  );
};
