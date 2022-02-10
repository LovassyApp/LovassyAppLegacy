import { Headline } from "react-native-paper";
import { ProductCard } from "../components/content/productCard";
import React from "react";
import { ScreenContainer } from "../components/screenContainer";
import { useSelector } from "react-redux";

export const StoreScreen = () => {
  const products = useSelector((state) => state.store.value);

  return (
    <ScreenContainer>
      <Headline>Store</Headline>
      <ProductCard product={products[0]} />
    </ScreenContainer>
  );
};
