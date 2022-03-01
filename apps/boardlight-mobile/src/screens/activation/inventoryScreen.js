/* eslint-disable indent */
import { Button, Headline, HelperText, Text, TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { InventoryItem } from "../../components/content/inventoryItem";
import { LaInput } from "../../components/content/customized/laInput";
import { ScreenContainer } from "../../components/screenContainer";
import { fetchInventory } from "../../utils/api/apiUtils";
import { matchSorter } from "match-sorter";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../../hooks/useLoading";
import { useSelector } from "react-redux";

export const InventoryScreen = ({ navigation }) => {
  const items = useSelector((state) => state.inventory.value);

  const [query, setQuery] = useState("");
  const [renderedItems, setRenderedItems] = useState(items);

  useEffect(() => {
    setRenderedItems(
      query === ""
        ? items
        : matchSorter(items, query, {
            keys: ["product.name", "product.description"],
            threshold: matchSorter.rankings.CONTAINS,
          }),
    );
  }, [query, items]);

  const client = useBlueboardClient();
  const loading = useLoading();

  const styles = StyleSheet.create({
    failedContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

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
        <View style={styles.failedContainer}>
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
