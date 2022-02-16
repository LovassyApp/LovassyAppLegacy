import { Divider, Headline, Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import { LaButton } from "../../components/content/customized/laButton";
import { LaCard } from "../../components/content/laCard";
import Markdown from "react-native-markdown-display";
import React from "react";
import { ScreenContainer } from "../../components/screenContainer";

export const ConfirmScreen = ({ navigation, route }) => {
  const item = route.params;
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      justifyContent: "space-between",
      flex: 1,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });

  const markdownStyle = {
    body: {
      color: theme.colors.text,
      fontFamily: "Poppins_400Regular",
    },
    strong: {
      fontFamily: "Poppins_700Bold",
    },
    em: {
      fontFamily: "Poppins_400Regular_Italic",
    },
    code_inline: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.background,
      fontFamily: "CourierPrime_400Regular",
    },
    code_block: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.background,
      fontFamily: "CourierPrime_400Regular",
    },
  };

  return (
    <ScreenContainer>
      <Headline>{item.product.name}</Headline>
      <View style={styles.container}>
        <View style={{ marginVertical: 5 }}>
          <LaCard title="Leirás">
            <Divider style={{ width: "100%", marginVertical: 5 }} />
            <Markdown style={markdownStyle}>{item.product.markdownContent}</Markdown>
          </LaCard>
        </View>
        <View style={styles.buttonContainer}>
          <LaButton
            dense={true}
            customStyle={{ margin: 10 }}
            onPress={() => navigation.navigate("Kezdőlap")}>
            Vissza
          </LaButton>
          <LaButton dense={true} customStyle={{ margin: 10 }} disabled={item.usedAt}>
            Beváltás
          </LaButton>
        </View>
      </View>
    </ScreenContainer>
  );
};
