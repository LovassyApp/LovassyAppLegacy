/* eslint-disable indent */
import { Headline, HelperText, TextInput } from "react-native-paper";

import { InventoryItem } from "../../components/content/inventoryItem";
import { LaInput } from "../../components/content/customized/laInput";
import React from "react";
import { ScreenContainer } from "../../components/screenContainer";
import { matchSorter } from "match-sorter";
import { useSelector } from "react-redux";

export const InventoryScreen = () => {
  const items = useSelector((state) => state.inventory.value);

  const [query, setQuery] = React.useState("");

  const getItems = () => {
    return renderedItems?.map((item, key) => (
      <InventoryItem last={key === (renderedItems ?? []).length - 1} data={item} key={item.id} />
    ));
  };

  const renderedItems =
    query === ""
      ? items
      : matchSorter(items, query, {
          keys: ["product.name", "product.description"],
          threshold: matchSorter.rankings.CONTAINS,
        });

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
