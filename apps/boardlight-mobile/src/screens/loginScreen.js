import {
  Button,
  Dialog,
  Headline,
  HelperText,
  Paragraph,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { removeRenewalError, setToken } from "../store/slices/tokenSlice";
import { useDispatch, useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import { LaButton } from "../components/content/customized/laButton";
import { LaInput } from "../components/content/customized/laInput";
import { ScreenContainer } from "../components/screenContainer";
import { eagerLoad } from "../utils/api/eagerLoad";
import { setControl } from "../store/slices/controlSlice";
import { setRefreshToken } from "../store/slices/refreshTokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../hooks/useLoading";
import useRenew from "../hooks/useRenew";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [generalError, setGeneralError] = useState("");

  const loading = useLoading();

  const renewalError = useSelector((state) => state.token.renewalError);
  const dispatch = useDispatch();

  const client = useBlueboardClient();
  const renew = useRenew();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    form: {
      width: "100%",
    },
    title: {
      alignSelf: "center",
      marginBottom: 20,
    },
    input: {
      marginBottom: 15,
      textAlign: "auto", // Must include due to react native bug with text wrapping on ios
    },
    buttonLabel: {
      color: "#fff",
      fontSize: 16,
    },
    buttonRow: {
      flexDirection: "row",
    },
    rowBackButton: {
      flex: 1,
      marginRight: 10,
    },
    rowNextButton: {
      flex: 1,
      marginLeft: 10,
    },
  });

  const doLogin = async () => {
    if (email === "") {
      setEmailError("Az e-mail mező kitöltése kötelező");
      setPasswordError("");
      return;
    } else if (password === "") {
      setEmailError("");
      setPasswordError("A jelszó mező kitöltése kötelező");
      return;
    }

    setEmailError("");
    setPasswordError("");

    loading(true);

    try {
      const res = await client.auth.login(`${email}@lovassy.edu.hu`, password, true);
      try {
        const control = await client.account.control(res.token);

        dispatch(setControl(control));

        renew(res.refreshToken);

        await eagerLoad(client, res.token);

        dispatch(setRefreshToken(res.refreshToken));

        loading(false);

        dispatch(setToken(res.token));
      } catch (err) {
        console.log(err);
        setGeneralError("A control lekérése sikertelen");

        loading(false);
      }
    } catch (err) {
      if (err.errors) {
        setEmailError(err.errors.email ?? "");
        setPasswordError(err.errors.password ?? "");
      } else if (err.message === "Bad credentials") {
        setEmailError("");
        setPasswordError("A megadott jelszó helytelen");
      } else {
        setGeneralError("Egy ismeretlen hiba történt");
      }

      loading(false);
    }
  };

  if (renewalError) {
    setGeneralError("Lejárt a hozzáférésed");
    dispatch(removeRenewalError());
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.form} behavior="position">
          <Headline style={styles.title}>Belépés</Headline>

          <LaInput
            label="E-mail"
            autoCorrect={false}
            value={email}
            error={emailError !== ""}
            style={emailError === "" ? styles.input : null}
            right={<TextInput.Affix text="@lovassy.edu.hu" />}
            onChangeText={(text) => setEmail(text)}
          />

          {emailError !== "" && <HelperText type="error">{emailError}</HelperText>}
          <LaInput
            label="Jelszó"
            autoCorrect={false}
            value={password}
            error={passwordError !== ""}
            style={passwordError === "" ? styles.input : null}
            secureTextEntry={true}
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={() => doLogin()}
            onChangeText={(text) => setPassword(text)}
          />
          {passwordError !== "" && <HelperText type="error">{passwordError}</HelperText>}
          <View style={styles.buttonRow}>
            <LaButton
              customStyle={styles.rowBackButton}
              onPress={() => navigation.navigate("Register")}>
              <Text style={styles.buttonLabel}>Regisztrálás</Text>
              <Ionicons name="arrow-forward" size={16} />
            </LaButton>
            <LaButton customStyle={styles.rowNextButton} onPress={async () => await doLogin()}>
              <Text style={styles.buttonLabel}>Belépés</Text>
              <Ionicons name="arrow-forward" size={16} />
            </LaButton>
          </View>
          <Portal>
            <Dialog visible={generalError !== ""}>
              <Dialog.Title>Hiba</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{generalError}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setGeneralError("")}>
                  {generalError === "Lejárt a hozzáférésed" ? "Ok" : "Újra"}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </KeyboardAvoidingView>
      </View>
    </ScreenContainer>
  );
};
