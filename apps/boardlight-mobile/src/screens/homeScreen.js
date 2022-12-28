import {
  Button,
  Dialog,
  Divider,
  Headline,
  HelperText,
  Portal,
  Subheading,
  Text,
} from "react-native-paper";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { fetchLolo, fetchRequests } from "../utils/api/apiUtils";
import {
  getCoinsFromGrades,
  getCoinsFromRequests,
  getTotalSpendings,
} from "../utils/misc/loloUtils";
import { usePermissions, useUser } from "../hooks/controlHooks";

import { LaCard } from "../components/content/laCard";
import { LaInput } from "../components/content/customized/laInput";
import { LaSnackbar } from "../components/content/customized/laSnackbar";
import { LoloCoin } from "../components/content/loloCoin";
import { RequestItem } from "../components/content/requestItem";
import { RestrictedWrapper } from "../components/restrictedWrapper";
import { ScreenContainer } from "../components/screenContainer";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../hooks/useLoading";
import { useSelector } from "react-redux";

export const HomeScreen = () => {
  const loading = useLoading();

  const coins = useSelector((state) => state.coins.value);
  const requests = useSelector((state) => state.requests.value);

  const [displayCoins, setDisplayCoins] = useState(false);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [titleError, setTitleError] = useState("");
  const [bodyError, setBodyError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarTimeout, setSnackBarTimeout] = useState(30000);

  const client = useBlueboardClient();
  const user = useUser();
  const permissions = usePermissions();

  const styles = StyleSheet.create({
    coinsContainer: {
      alignItems: "center",
    },
    balanceView: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 5,
    },
    space: {
      height: 50,
    },
  });

  const tryAgainCoins = async () => {
    loading(true);

    try {
      await fetchLolo(client);
    } catch (err) {
      console.log(err);
    }

    loading(false);
  };

  const tryAgainRequests = async () => {
    loading(true);

    try {
      await fetchRequests(client);
    } catch (err) {
      console.log(err);
    }

    loading(false);
  };

  const getCoins = () => {
    return coins?.map((coin) => <LoloCoin data={coin} key={coin.id} minimal={true} />);
  };

  const getRequest = () => {
    return requests?.map((request) => (
      <RequestItem data={request} key={request.id} minimal={true} />
    ));
  };

  const sendRequest = async () => {
    if (requestTitle === "") {
      setTitleError("A cím kitöltése kötelező");
    } else {
      setTitleError("");
    }
    if (requestBody === "") {
      setBodyError("A törzsszöveg kitöltése kötelező");
    } else {
      setBodyError("");
    }
    if (titleError === "" && bodyError === "") {
      setShowNewRequest(false);
      setSnackBarOpen(true);
      setSnackBarMessage("Küldés folyamatban...");
      try {
        await client.lolo_request.make(requestTitle, requestBody);
        setSnackBarMessage("Küldés sikeres!");
        setSnackBarTimeout(3000);
      } catch (err) {
        setSnackBarMessage("Küldés sikertelen!");
        setSnackBarTimeout(3000);
      }
    }
  };

  return (
    <>
      <ScreenContainer scrollable={true}>
        <Headline>Kezdőlap</Headline>
        <LaCard
          title={displayCoins ? "Érmék" : "Egyenleg"}
          actionIcon={
            permissions.includes("General::Lolo")
              ? displayCoins
                ? "arrow-back"
                : "arrow-forward"
              : null
          }
          onPress={() => setDisplayCoins(!displayCoins)}
          error={coins === null && permissions.includes("General::Lolo")}
          retry={() => tryAgainCoins()}>
          {displayCoins ? (
            <>{getCoins()}</>
          ) : (
            <>
              <View style={styles.balanceView}>
                <Subheading>Jelenlegi egyenleg:</Subheading>
                <Subheading>{user.balance}</Subheading>
              </View>

              <RestrictedWrapper permission="General::Lolo">
                <Divider style={{ width: "100%", marginVertical: 5 }} />
                <View style={styles.balanceView}>
                  <Text>Összes loló jegyekből:</Text>
                  <Text>{getCoinsFromGrades(coins)}</Text>
                </View>
                <View style={styles.balanceView}>
                  <Text>Összes loló kérvényekből:</Text>
                  <Text>{getCoinsFromRequests(coins)}</Text>
                </View>
                <View style={styles.balanceView}>
                  <Text>Összes elköltött loló:</Text>
                  <Text>{getTotalSpendings(coins)}</Text>
                </View>
              </RestrictedWrapper>
            </>
          )}
        </LaCard>
        <LaCard
          title="Kérvények"
          actionIcon={permissions.includes("Requests::CreateRequest") && "add"}
          onPress={() => setShowNewRequest(true)}
          error={requests === null && permissions.includes("Requests::ViewOwnRequests")}
          retry={() => tryAgainRequests()}>
          <RestrictedWrapper permission="Requests::ViewOwnRequests">
            {requests.length === 0 ? (
              <Text style={{ alignSelf: "center", margin: 25 }}>
                Úgy néz ki nincsenek kérvényeid
              </Text>
            ) : (
              getRequest()
            )}
          </RestrictedWrapper>
        </LaCard>

        <View style={styles.space} />

        <Portal>
          {showNewRequest && (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
              <View style={{ flex: 1 }}>
                <Dialog visible={true} dismissable={false}>
                  <Dialog.Title>Új kérvény létrehozása</Dialog.Title>
                  <Dialog.Content>
                    <LaInput
                      label="Cím"
                      dense={true}
                      error={titleError !== ""}
                      value={requestTitle}
                      onChangeText={(text) => setRequestTitle(text)}
                      style={{ marginVertical: 5 }}
                    />
                    {titleError !== "" && (
                      <HelperText style={{ marginTop: -5, marginBottom: -5 }} type="error">
                        {titleError}
                      </HelperText>
                    )}
                    <LaInput
                      label="Törzsszöveg"
                      value={requestBody}
                      onChangeText={(text) => setRequestBody(text)}
                      dense={true}
                      error={bodyError !== ""}
                      style={{ marginVertical: 5 }}
                      multiline={true}
                    />
                    {bodyError !== "" && (
                      <HelperText style={{ marginTop: -5, marginBottom: -5 }} type="error">
                        {bodyError}
                      </HelperText>
                    )}
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={() => setShowNewRequest(false)}>Mégse</Button>
                    <Button onPress={() => sendRequest()}>Küldés</Button>
                  </Dialog.Actions>
                </Dialog>
              </View>
            </KeyboardAvoidingView>
          )}
        </Portal>
      </ScreenContainer>
      {snackBarOpen && (
        <LaSnackbar
          visible={snackBarOpen}
          onDismiss={() => {
            setSnackBarOpen(false);
            setSnackBarTimeout(30000);
          }}
          duration={snackBarTimeout}>
          {snackBarMessage}
        </LaSnackbar>
      )}
    </>
  );
};
