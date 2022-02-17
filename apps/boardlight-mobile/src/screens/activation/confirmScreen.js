import { Divider, Headline, Subheading, Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import { InputRenderer } from "../../components/inputRenderer";
import { Ionicons } from "@expo/vector-icons";
import { LaButton } from "../../components/content/customized/laButton";
import { LaCard } from "../../components/content/laCard";
import Markdown from "react-native-markdown-display";
import React from "react";
import { ScreenContainer } from "../../components/screenContainer";

export const ConfirmScreen = ({ navigation, route }) => {
  const item = route.params;
  const theme = useTheme();

  const getInitialInputState = React.useCallback(() => {
    const obj = {};

    const inputs = item.product.inputs ?? [];

    inputs.forEach((el) => {
      if (el.type === "textbox") {
        obj[el.name] = "";
      }

      if (el.type === "boolean") {
        obj[el.name] = false;
      }
    });

    return obj;
  }, [item]);

  const [inputState, setInputState] = React.useState(getInitialInputState());
  const [errors, setErrors] = React.useState({});

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

  const confirm = () => {
    setErrors({});
    validateInputs();
  };

  const validateInputs = () => {
    const obj = {};

    const inputs = item.product.inputs ?? [];

    inputs.forEach((el) => {
      if (el.type === "textbox" && inputState[el.name] === "") {
        obj[el.name] = `A ${el.title} mező kitöltése kötelező`;
      }
    });

    setErrors(obj);
  };

  return (
    <ScreenContainer>
      <Headline>{item.product.name}</Headline>
      <View style={styles.container}>
        <View style={{ marginVertical: 5 }}>
          <LaCard title="Leírás">
            <Divider style={{ width: "100%", marginVertical: 5 }} />
            <Markdown style={markdownStyle}>{item.product.markdownContent}</Markdown>
          </LaCard>
          {item.product.inputs.length !== 0 && (
            <LaCard title="Inputok">
              <Divider style={{ width: "100%", marginVertical: 5 }} />
              <InputRenderer
                inputs={item.product.inputs}
                onChange={(input, value) => {
                  const newState = { ...inputState };
                  newState[input] = value;
                  setInputState(newState);
                }}
                errors={errors}
                inputState={inputState}
              />
            </LaCard>
          )}
          <LaCard title="Beváltás">
            <Divider style={{ width: "100%", marginVertical: 5 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Subheading>
                {item.product.codeActivated ? "Kóddal aktiválható" : "Magában aktiválható"}
              </Subheading>
              <Ionicons
                name={item.product.codeActivated ? "qr-code" : "checkmark-circle"}
                size={24}
                color={theme.colors.text}
              />
            </View>
          </LaCard>
        </View>
        <View style={styles.buttonContainer}>
          <LaButton
            dense={true}
            customStyle={{ margin: 10 }}
            onPress={() => navigation.navigate("Kezdőlap")}>
            Vissza
          </LaButton>
          <LaButton
            dense={true}
            customStyle={{ margin: 10 }}
            disabled={item.usedAt}
            onPress={() => confirm()}>
            Beváltás
          </LaButton>
        </View>
      </View>
    </ScreenContainer>
  );
};
