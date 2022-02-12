import { Divider, Headline, Subheading, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import { BlueboardLoloReason } from "blueboard-client";
import { LaButton } from "../components/content/customized/laButton";
import { LaCard } from "../components/content/laCard";
import { LoloCoin } from "../components/content/loloCoin";
import React from "react";
import { ScreenContainer } from "../components/screenContainer";
import { fetchLolo } from "../utils/api/apiUtils";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../hooks/useLoading";
import { useSelector } from "react-redux";

export const HomeScreen = ({ navigation }) => {
  const loading = useLoading();

  const lolo = useSelector((state) => state.lolo.value);

  const [displayCoins, setDisplayCoins] = React.useState(false);

  const client = useBlueboardClient();

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

  const getCoinsFromGrades = () => {
    var res = 0;

    for (const coin of lolo.coins) {
      if (
        coin.reason === BlueboardLoloReason.FromFive ||
        coin.reason === BlueboardLoloReason.FromFour
      ) {
        res++;
      }
    }

    return res;
  };

  const getCoinsFromRequests = () => {
    var res = 0;

    for (const coin of lolo.coins) {
      if (coin.reason === BlueboardLoloReason.FromRequest) {
        res++;
      }
    }

    return res;
  };

  const getCoins = () => {
    return lolo?.coins.map((coin) => <LoloCoin coin={coin} key={coin.id} minimal={true} />);
  };

  const getTotalSpendings = () => {
    var res = 0;

    for (const coin of lolo.coins) {
      if (coin.isSpent === 1) {
        res++;
      }
    }

    return res;
  };

  return (
    <ScreenContainer scrollable={true}>
      <Headline>Kezdőlap</Headline>
      <LaCard
        title={displayCoins ? "Kérelmek és érmék" : "Egyenleg"}
        actionIcon={displayCoins ? "arrow-back" : "arrow-forward"}
        onPress={() => setDisplayCoins(!displayCoins)}
        error={lolo === null}
        retry={() => tryAgain()}>
        {displayCoins ? (
          <>
            <Subheading style={{ marginVertical: 5 }}>Kérelmek</Subheading>
            {/* TODO: finish this */}
            <View style={{ height: 100, justifyContent: "center" }}>
              <Text style={{ textAlign: "center" }}>Úgy néz ki nincsenek kérelmeid</Text>
            </View>
            <Subheading style={{ marginVertical: 5 }}>Érmék</Subheading>
            {getCoins()}
          </>
        ) : (
          <>
            <View style={styles.balanceView}>
              <Subheading>Jelenlegi egyenleg:</Subheading>
              <Subheading>{lolo?.balance}</Subheading>
            </View>

            <Divider style={{ width: "100%", marginVertical: 5 }} />
            <View style={styles.balanceView}>
              <Text>Összes loló jegyekből:</Text>
              <Text>{getCoinsFromGrades()}</Text>
            </View>
            <View style={styles.balanceView}>
              <Text>Összes loló kérelmekből:</Text>
              <Text>{getCoinsFromRequests()}</Text>
            </View>
            <View style={styles.balanceView}>
              <Text>Összes elköltött loló:</Text>
              <Text>{getTotalSpendings()}</Text>
            </View>
          </>
        )}
      </LaCard>
      <LaCard title="Birtokolt termékek" actionIcon="arrow-forward">
        <Text style={{ alignSelf: "center", margin: 25 }}>Úgy néz ki nincs semmid</Text>
        <LaButton dense={true} onPress={() => navigation.navigate("Áruház")}>
          Irány az áruház
        </LaButton>
      </LaCard>
    </ScreenContainer>
  );
};
