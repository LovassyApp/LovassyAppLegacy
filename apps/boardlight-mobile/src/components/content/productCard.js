import { Badge, Caption, Card, Chip, Text, Title, useTheme } from "react-native-paper";
import { Image, ImageBackground, StyleSheet, View } from "react-native";

import { LaButton } from "./customized/laButton";
import { LaCard } from "./laCard";
import React from "react";

export const ProductCard = (props) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    spaced: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    inline: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    container: {
      padding: 10,
      height: 200,
      justifyContent: "flex-end",
    },
    titleContainer: {
      padding: 10,
      width: "70%",
    },
    imgContainer: {
      height: 200,
      width: "100%",
    },
    img: {
      borderTopLeftRadius: theme.roundness,
      borderTopRightRadius: theme.roundness,
    },
  });

  return (
    <Card>
      <ImageBackground
        style={styles.imgContainer}
        imageStyle={styles.img}
        source={{ uri: props.product.imageUrl }}>
        <View style={styles.container}>
          <View style={styles.inline}>
            <View style={{ flexDirection: "row" }}>
              <Chip
                style={{
                  backgroundColor: theme.colors.accent,
                  marginBottom: 2,
                  marginRight: 10,
                }}>
                {props.product.price} Loló
              </Chip>
              <Chip style={{ backgroundColor: theme.colors.accent, marginBottom: 2 }}>
                Raktáron: {props.product.quantity} db
              </Chip>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.spaced}>
        <View style={styles.titleContainer}>
          <Title numberOfLines={1}>{props.product.name}</Title>
          <Caption>{props.product.description}</Caption>
        </View>
        <LaButton style={{ alignSelf: "center", margin: 10 }} dense={true}>
          Get
        </LaButton>
      </View>
    </Card>
  );
};
