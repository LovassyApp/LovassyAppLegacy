import {
  Button,
  Chip,
  Divider,
  Headline,
  Snackbar,
  Subheading,
  Text,
  Title,
  useTheme,
} from "react-native-paper";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useBlueboardClient, useBlueboardPrivateChannel } from "blueboard-client-react";
import { useDispatch, useSelector } from "react-redux";
import { useStatefulEvent, useStatefulListener } from "../hooks/eventHooks";

import BottomSheet from "../components/bottomSheet";
import { LaButton } from "../components/content/customized/laButton";
import { ProductCard } from "../components/content/productCard";
import { ScreenContainer } from "../components/screenContainer";
import { setStore } from "../store/slices/storeSlice";

export const StoreScreen = () => {
  const products = useSelector((state) => state.store.value);
  const lolo = useSelector((state) => state.lolo.value);

  const bottomSheetRef = useRef();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarTimeout, setSnackBarTimeout] = useState(null);

  const theme = useTheme();
  const client = useBlueboardClient();

  const getProducts = () => {
    return products?.map((product) => (
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
      setSnackBarTimeout(2000);
    } catch (err) {
      setSnackBarMessage("Vásárlás sikertelen!");
      setSnackBarTimeout(2000);
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

  return (
    <>
      <ScreenContainer scrollable={true}>
        <Headline>Store</Headline>

        {getProducts()}

        <BottomSheet
          backgroundColor={theme.colors.backdrop}
          sheetBackgroundColor={theme.dark ? "#1e1e1e" : theme.colors.surface}
          radius={theme.roundness}
          ref={bottomSheetRef}
          height={460}>
          <View style={styles.sheetContainer}>
            <Title style={{ alignSelf: "center", marginBottom: 10 }}>
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
                {lolo.balance} - {currentProduct?.price} = {lolo.balance - currentProduct?.price}{" "}
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
              <LaButton dense={true} onPress={() => buyCallback(currentProduct?.id)}>
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
            setSnackBarTimeout(null);
          }}
          theme={theme}
          duration={snackBarTimeout}>
          {snackBarMessage}
        </Snackbar>
      )}
    </>
  );
};
