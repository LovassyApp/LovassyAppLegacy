import { Divider, Headline, Subheading, Text, Title, useTheme } from "react-native-paper";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { BlueboardLoloReason } from "blueboard-client";
import BottomSheet from "../components/bottomSheet";
import { GradeItem } from "../components/content/gradeItem";
import { LaButton } from "../components/content/customized/laButton";
import { LaCard } from "../components/content/laCard";
import { LoloCoin } from "../components/content/loloCoin";
import { ScreenContainer } from "../components/screenContainer";
import { fetchCoins } from "../utils/api/apiUtils";
import { setUser } from "../store/slices/controlSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../hooks/useLoading";
import { useUser } from "../hooks/controlHooks";

export const HomeScreen = ({ navigation }) => {
  const loading = useLoading();

  const dispatch = useDispatch();
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
      await fetchCoins(client);
    } catch (err) {
      console.log(err);
    }

    loading(false);
  };

  const getCoinsFromGrades = () => {
    var res = 0;

    for (const coin of coins) {
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

    for (const coin of coins) {
      if (coin.reason === BlueboardLoloReason.FromRequest) {
        res++;
      }
    }

    return res;
  };

  const getCoins = () => {
    return coins?.map((coin) => <LoloCoin data={coin} key={coin.id} minimal={true} />);
  };

  const getTotalSpendings = () => {
    var res = 0;

    for (const coin of coins) {
      if (coin.isSpent) {
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
        error={coins === null}
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
              <Subheading>{user.balance}</Subheading>
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
