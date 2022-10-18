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

import { Ionicons } from "@expo/vector-icons";
import { LaButton } from "../components/content/customized/laButton";
import { LaInput } from "../components/content/customized/laInput";
import { ScreenContainer } from "../components/screenContainer";
import { eagerLoad } from "../utils/api/eagerLoad";
import { setControl } from "../store/slices/controlSlice";
import { setRefreshToken } from "../store/slices/refreshTokenSlice";
import { setToken } from "../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import { useLoading } from "../hooks/useLoading";
import useRenew from "../hooks/useRenew";

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [stageTwo, setStageTwo] = useState(false);

  const [name, setName] = useState("");
  const [omId, setOmId] = useState("");

  const [nameError, setNameError] = useState("");
  const [omIdError, setOmIdError] = useState("");

  const [generalError, setGeneralError] = useState("");

  const loading = useLoading();

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

  const next = () => {
    if (email === "") {
      setEmailError("Az e-mail mező kitöltése kötelező");
    } else if (password === "") {
      setEmailError("");
      setPasswordError("A jelszó mező kitöltése kötelező");
    } else if (confirmPassword === "") {
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("A jelszó megerősítése mező kitöltése kötelező");
    } else if (password !== confirmPassword) {
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("A jelszavak nem egyeznek");
    } else {
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");
      setStageTwo(true);
    }
  };

  const finish = async () => {
    if (name === "") {
      setNameError("A név mező kitöltése kötelező");
      setOmIdError("");
      return;
    } else if (omId === "") {
      setNameError("");
      setOmIdError("Az OM azonosító mező kitöltése kötelező");
      return;
    }

    setNameError("");
    setOmIdError("");

    loading(true);

    try {
      await client.auth.register(`${email}@lovassy.edu.hu`, password, name, omId);
    } catch (err) {
      // I love working with ts stuff inside js
      if (err.errors && Object.keys(err.errors).length !== 0) {
        setEmailError(err.errors.email ?? "");
        setPasswordError(err.errors.password ?? "");
        setNameError(err.errors.name ?? "");
        setOmIdError(err.errors.om_code ?? "");

        setStageTwo(false);
      } else {
        console.log(err);
        setGeneralError("Egy ismeretlen hiba történt");
      }

      loading(false);

      return;
    }

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
        setGeneralError("A control lekérése sikertelen");

        loading(false);
      }
    } catch (err) {
      setGeneralError("Valami nagyon nagy hiba van itt, mert ezt sose kéne látnod");

      loading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.form} behavior="position">
          <Headline style={styles.title}>Regisztrálás</Headline>
          {!stageTwo ? (
            <>
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
                textContentType="newPassword"
                onChangeText={(text) => setPassowrd(text)}
              />
              {passwordError !== "" && <HelperText type="error">{passwordError}</HelperText>}
              <LaInput
                label="Jelszó megerősítése"
                autoCorrect={false}
                value={confirmPassword}
                error={confirmPasswordError !== ""}
                style={confirmPasswordError === "" ? styles.input : null}
                secureTextEntry={true}
                returnKeyType="go"
                onSubmitEditing={() => next()}
                onChangeText={(text) => setConfirmPassword(text)}
              />
              {confirmPasswordError !== "" && (
                <HelperText type="error">{confirmPasswordError}</HelperText>
              )}
              <View style={styles.buttonRow}>
                <LaButton
                  customStyle={styles.rowBackButton}
                  onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.buttonLabel}>Belépés</Text>
                  <Ionicons name="arrow-forward" size={16} />
                </LaButton>
                <LaButton customStyle={styles.rowNextButton} onPress={() => next()}>
                  <Text style={styles.buttonLabel}>Tovább</Text>
                  <Ionicons name="arrow-forward" size={16} />
                </LaButton>
              </View>
            </>
          ) : (
            <>
              <LaInput
                label="Név"
                autoCorrect={false}
                style={nameError === "" ? styles.input : null}
                value={name}
                error={nameError !== ""}
                textContentType="username"
                onChangeText={(text) => setName(text)}
              />
              {nameError !== "" && <HelperText type="error">{nameError}</HelperText>}
              <LaInput
                label="OM Azonosító"
                autoCorrect={false}
                style={omIdError === "" ? styles.input : null}
                value={omId}
                error={omIdError !== ""}
                onChangeText={(text) => setOmId(text)}
              />
              {omIdError !== "" && <HelperText type="error">{omIdError}</HelperText>}
              <View style={styles.buttonRow}>
                <LaButton customStyle={styles.rowBackButton} onPress={() => setStageTwo(false)}>
                  <Ionicons name="arrow-back" size={16} />
                  <Text style={styles.buttonLabel}>Vissza</Text>
                </LaButton>
                <LaButton customStyle={styles.rowNextButton} onPress={async () => await finish()}>
                  <Text style={styles.buttonLabel}>Befejezés</Text>
                  <Ionicons name="arrow-forward" size={16} />
                </LaButton>
              </View>
              <Portal>
                <Dialog visible={generalError !== ""} dismissable={false}>
                  <Dialog.Title>Hiba</Dialog.Title>
                  <Dialog.Content>
                    <Paragraph>{generalError}</Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={() => setGeneralError("")}>Újra</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </ScreenContainer>
  );
};
