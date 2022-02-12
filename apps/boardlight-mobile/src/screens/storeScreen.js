/* eslint-disable indent */
import {
  Button,
  Chip,
  Headline,
  HelperText,
  Snackbar,
  Subheading,
  Text,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { fetchLolo, fetchStore } from "../utils/api/apiUtils";
import { useBlueboardClient, useBlueboardPrivateChannel } from "blueboard-client-react";

import BottomSheet from "../components/bottomSheet";
import { LaButton } from "../components/content/customized/laButton";
import { LaInput } from "../components/content/customized/laInput";
import { ProductCard } from "../components/content/productCard";
import { ScreenContainer } from "../components/screenContainer";
import { matchSorter } from "match-sorter";
import { useLoading } from "../hooks/useLoading";
import { useSelector } from "react-redux";

export const StoreScreen = () => {
  const products = useSelector((state) => state.store.value);
  const lolo = useSelector((state) => state.lolo.value);

  const bottomSheetRef = useRef();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarTimeout, setSnackBarTimeout] = useState(30000);
  const [query, setQuery] = React.useState("");

  const theme = useTheme();
  const client = useBlueboardClient();
  const loading = useLoading();

  const renderedProducts =
    query === ""
      ? products
      : matchSorter(products, query, {
          keys: ["name", "description"],
          threshold: matchSorter.rankings.CONTAINS,
        });

  const getProducts = () => {
    return renderedProducts?.map((product) => (
      <ProductCard key={product.id} product={product} onPress={() => openBuy(product)} />
    ));
  };

  const updateCallback = (data) => {
    const { product } = data;

    if (product.id === currentProduct?.id) {
      setCurrentProduct(product);
    }
  };

  useBlueboardPrivateChannel("Store", "ProductUpdated", updateCallback);

  const openBuy = (product) => {
    setCurrentProduct(product);
    bottomSheetRef.current.show();
  };

  const getInputs = () => {
    return currentProduct?.inputs?.map((input) => (
      <Chip key={input.name} style={{ marginBottom: 5 }}>
        {input.title} ({input.type === "textbox" ? "Szöveg" : "Igen/Nem"})
      </Chip>
    ));
  };

  const buyCallback = async (id) => {
    bottomSheetRef.current.close();
    setSnackBarOpen(true);
    setSnackBarMessage("Vásárlás folyamatban...");
    try {
      await client.store.buy(id);
      setSnackBarMessage("Vásárlás sikeres!");
      setSnackBarTimeout(4000);
    } catch (err) {
      setSnackBarMessage("Vásárlás sikertelen!");
      setSnackBarTimeout(4000);
    }
  };

  const styles = StyleSheet.create({
    sheetContainer: {
      flex: 1,
      padding: 20,
    },
    inline: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginVertical: 10,
    },
  });

  const tryAgain = async () => {
    loading(true);

    try {
      await fetchLolo(client);
      await fetchStore(client);
    } catch (err) {
      console.log(err);
    }

    loading(false);
  };

  if (!lolo || !products) {
    return (
      <ScreenContainer>
        <Headline>Store</Headline>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Unable to fetch data</Text>
          <Button onPress={() => tryAgain()}>Try Again</Button>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <>
      <ScreenContainer scrollable={true}>
        <Headline>Store</Headline>

        <LaInput
          style={{ marginBottom: 5 }}
          value={query}
          onChangeText={(text) => setQuery(text)}
          dense={true}
          right={
            <TextInput.Icon name="close" onPress={() => setQuery("")} forceTextInputFocus={false} />
          }
          error={renderedProducts.length === 0 && products.length !== 0}
          blurOnSubmit={true}
          returnKeyType="search"
          placeholder="Keresés"
        />
        {renderedProducts.length === 0 && products.length !== 0 && (
          <HelperText style={{ marginTop: -5 }} type="error">
            No products found
          </HelperText>
        )}
        {getProducts()}

        <BottomSheet
          backgroundColor={theme.colors.backdrop}
          sheetBackgroundColor={theme.dark ? "#1e1e1e" : theme.colors.surface}
          radius={theme.roundness}
          ref={bottomSheetRef}
          height={460}>
          <View style={styles.sheetContainer}>
            <Title style={{ textAlign: "center", marginBottom: 10 }}>
              Buy - {currentProduct?.name}
            </Title>
            <View style={styles.inline}>
              {currentProduct?.inputs.length !== 0 && <Subheading>Inputs: </Subheading>}
              {getInputs()}
            </View>
            <View style={styles.inline}>
              <Subheading>Activation: </Subheading>
              <Chip style={{ marginBottom: 5 }}>
                {currentProduct?.codeActivated ? "Kóddal aktiválható" : "Magában aktiválható"}
              </Chip>
            </View>
            <View style={styles.inline}>
              <Subheading>Final Balance: </Subheading>
              <Chip style={{ marginBottom: 5 }}>
                {lolo?.balance} - {currentProduct?.price} = {lolo?.balance - currentProduct?.price}{" "}
                Loló
              </Chip>
            </View>
            <View style={styles.inline}>
              <Subheading>In stock: </Subheading>
              <Chip style={{ marginBottom: 5 }}>{currentProduct?.quantity} Darab</Chip>
            </View>
            <View style={{ ...styles.inline, justifyContent: "space-between" }}>
              <LaButton dense={true} onPress={() => bottomSheetRef.current.close()}>
                Cancel
              </LaButton>
              <LaButton
                dense={true}
                onPress={() => buyCallback(currentProduct?.id)}
                disabled={lolo?.balance < currentProduct?.price || currentProduct?.quantity === 0}>
                Buy
              </LaButton>
            </View>
          </View>
        </BottomSheet>
      </ScreenContainer>
      {snackBarOpen && (
        <Snackbar
          visible={snackBarOpen}
          onDismiss={() => {
            setSnackBarOpen(false);
            setSnackBarTimeout(30000);
          }}
          theme={theme}
          duration={snackBarTimeout}>
          {snackBarMessage}
        </Snackbar>
      )}
    </>
  );
};
