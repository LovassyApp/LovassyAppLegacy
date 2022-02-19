import { Divider, Headline, Subheading, Text, Title, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import {
  getCoinsFromGrades,
  getCoinsFromRequests,
  getTotalSpendings,
} from "../utils/misc/loloUtils";

import { LaButton } from "../components/content/customized/laButton";
import { LaCard } from "../components/content/laCard";
import { LoloCoin } from "../components/content/loloCoin";
import React from "react";
import { ScreenContainer } from "../components/screenContainer";
import { fetchLolo } from "../utils/api/apiUtils";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../hooks/useLoading";
import { useSelector } from "react-redux";
import { useUser } from "../hooks/controlHooks";

export const HomeScreen = () => {
  const loading = useLoading();

  const coins = useSelector((state) => state.coins.value);

  const [displayCoins, setDisplayCoins] = React.useState(false);

  const client = useBlueboardClient();
  const user = useUser();

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
  });

  const tryAgain = async () => {
    loading(true);

    try {
      await fetchLolo(client);
    } catch (err) {
      console.log(err);
    }

    loading(false);
  };

  const getCoins = () => {
    return coins?.map((coin) => <LoloCoin data={coin} key={coin.id} minimal={true} />);
  };

  return (
    <ScreenContainer scrollable={true}>
      <Headline>Kezdőlap</Headline>
      <LaCard
        title={displayCoins ? "Érmék" : "Egyenleg"}
        actionIcon={displayCoins ? "arrow-back" : "arrow-forward"}
        onPress={() => setDisplayCoins(!displayCoins)}
        error={coins === null}
        retry={() => tryAgain()}>
        {displayCoins ? (
          <>{getCoins()}</>
        ) : (
          <>
            <View style={styles.balanceView}>
              <Subheading>Jelenlegi egyenleg:</Subheading>
              <Subheading>{user.balance}</Subheading>
            </View>

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
          </>
        )}
      </LaCard>
      <LaCard title="Kérelmek">
        <Text style={{ alignSelf: "center", margin: 25 }}>Úgy néz ki nincsenek kérelmeid</Text>
        <LaButton dense={true} onPress={() => {}}>
          Kérelem létrehozása
        </LaButton>
      </LaCard>
    </ScreenContainer>
  );
};
