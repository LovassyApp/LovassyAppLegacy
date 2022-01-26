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
import { fetchControl, login, register, setRenewal } from "../utils/api/accountUtils";

import { FullScreenLoading } from "../components/fullScreenLoading";
import { Ionicons } from "@expo/vector-icons";
import { LaButton } from "../components/content/customized/laButton";
import { LaInput } from "../components/content/customized/laInput";
import { ScreenContainer } from "../components/screenContainer";
import { fetchLolo } from "../utils/api/apiUtils";
import { secureSaveData } from "../utils/misc/storageUtils";
import { setControl } from "../store/slices/controlSlice";
import { setRefreshToken } from "../store/slices/refreshTokenSlice";
import { setToken } from "../store/slices/tokenSlice";
import store from "../store/store";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import useRenew from "../hooks/useRenew";

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [stageTwo, setStageTwo] = useState(false);

  const [kretaUsername, setKretaUsername] = useState("");
  const [kretaPassword, setKretaPassword] = useState("");

  const [kretaUsernameError, setKretaUsernameError] = useState("");
  const [kretaPasswordError, setKretaPasswordError] = useState("");

  const [generalError, setGeneralError] = useState("");

  const [loading, setLoading] = useState(false);

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
      setEmailError("Email cannot be empty");
    } else if (password === "") {
      setEmailError("");
      setPasswordError("Password cannot be empty");
    } else if (confirmPassword === "") {
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("Confirm password cannot be empty");
    } else if (password !== confirmPassword) {
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("Passwords do not match");
    } else {
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");
      setStageTwo(true);
    }
  };

  const finish = async () => {
    if (kretaUsername === "") {
      setKretaUsernameError("Kreta username cannot be empty");
      setKretaPasswordError("");
      return;
    } else if (kretaPassword === "") {
      setKretaUsernameError("");
      setKretaPasswordError("Kreta password cannot be empty");
      return;
    }

    setKretaUsernameError("");
    setKretaPasswordError("");

    setLoading(true);

    try {
      await client.auth.register(`${email}@lovassy.edu.hu`, password, kretaUsername, kretaPassword);
    } catch (err) {
      // I love working with ts stuff inside js
      if (err.errors && Object.keys(err.errors).length !== 0) {
        setEmailError(err.errors.email ?? "");
        setPasswordError(err.errors.password ?? "");

        // To get rid of previous errors with kreta stuff
        setKretaUsernameError("");
        setKretaPasswordError("");

        setStageTwo(false);
      } else if (err.isKretaError) {
        setGeneralError("Invalid kreta credentials");
      } else {
        setGeneralError("An unknown error occured");
      }

      setLoading(false);

      return;
    }

    try {
      const res = await client.auth.login(`${email}@lovassy.edu.hu`, password, true);

      try {
        const control = await client.account.control(res.token);

        dispatch(setControl(control));

        renew(res.refreshToken);

        await fetchLolo(client, true, res.token);

        dispatch(setRefreshToken(res.refreshToken));

        setLoading(false);

        dispatch(setToken(res.token));
      } catch (err) {
        setGeneralError("Couldn't fetch control");

        setLoading(false);
      }
    } catch (err) {
      setGeneralError(
        "Something went seriously wrong because you shouldn't be able to ever see this",
      );

      setLoading(false);
    }
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.form} behavior="position">
          <Headline style={styles.title}>Please register</Headline>
          {!stageTwo ? (
            <>
              <LaInput
                label="Email"
                value={email}
                error={emailError !== ""}
                style={emailError === "" ? styles.input : null}
                right={<TextInput.Affix text="@lovassy.edu.hu" />}
                onChangeText={(text) => setEmail(text)}
              />
              {emailError !== "" && <HelperText type="error">{emailError}</HelperText>}
              <LaInput
                label="Password"
                value={password}
                error={passwordError !== ""}
                style={passwordError === "" ? styles.input : null}
                secureTextEntry={true}
                textContentType="newPassword"
                onChangeText={(text) => setPassowrd(text)}
              />
              {passwordError !== "" && <HelperText type="error">{passwordError}</HelperText>}
              <LaInput
                label="Confirm Password"
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
                  <Text style={styles.buttonLabel}>Log in</Text>
                  <Ionicons name="arrow-forward" size={16} />
                </LaButton>
                <LaButton customStyle={styles.rowNextButton} onPress={() => next()}>
                  <Text style={styles.buttonLabel}>Next</Text>
                  <Ionicons name="arrow-forward" size={16} />
                </LaButton>
              </View>
            </>
          ) : (
            <>
              <LaInput
                label="Kreta username"
                style={kretaUsernameError === "" ? styles.input : null}
                value={kretaUsername}
                error={kretaUsernameError !== ""}
                textContentType="username"
                onChangeText={(text) => setKretaUsername(text)}
              />
              {kretaUsernameError !== "" && (
                <HelperText type="error">{kretaUsernameError}</HelperText>
              )}
              <LaInput
                label="Kreta password"
                style={kretaPasswordError === "" ? styles.input : null}
                value={kretaPassword}
                error={kretaPasswordError !== ""}
                secureTextEntry={true}
                textContentType="password"
                onChangeText={(text) => setKretaPassword(text)}
              />
              {kretaPasswordError !== "" && (
                <HelperText type="error">{kretaPasswordError}</HelperText>
              )}
              <View style={styles.buttonRow}>
                <LaButton customStyle={styles.rowBackButton} onPress={() => setStageTwo(false)}>
                  <Ionicons name="arrow-back" size={16} />
                  <Text style={styles.buttonLabel}>Back</Text>
                </LaButton>
                <LaButton customStyle={styles.rowNextButton} onPress={async () => await finish()}>
                  <Text style={styles.buttonLabel}>Finish</Text>
                  <Ionicons name="arrow-forward" size={16} />
                </LaButton>
              </View>
              <Portal>
                <Dialog visible={generalError !== ""} dismissable={false}>
                  <Dialog.Title>Error</Dialog.Title>
                  <Dialog.Content>
                    <Paragraph>{generalError}</Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={() => setGeneralError("")}>Retry</Button>
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
