import { Divider, Headline, Subheading, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import { BlueboardLoloReason } from "blueboard-client";
import { LaButton } from "../components/content/customized/laButton";
import { LaCard } from "../components/content/laCard";
import React from "react";
import { ScreenContainer } from "../components/screenContainer";
import { fetchLolo } from "../utils/api/apiUtils";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../hooks/useLoading";
import { useSelector } from "react-redux";

export const HomeScreen = ({ navigation }) => {
  const loading = useLoading();

  const lolo = useSelector((state) => state.lolo.value);

  const client = useBlueboardClient();

  const styles = StyleSheet.create({
    balanceContainer: {
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
    <ScreenContainer>
      <Headline>Home</Headline>
      <LaCard
        title="Balance"
        actionIcon="arrow-forward"
        error={lolo === null}
        retry={() => tryAgain()}>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceView}>
            <Subheading>Current balance:</Subheading>
            <Subheading>{lolo?.balance}</Subheading>
          </View>

          {lolo?.coins && Object.keys(lolo.coins).length !== 0 && (
            <>
              <Divider style={{ width: "100%", marginVertical: 5 }} />
              <View style={styles.balanceView}>
                <Text>Total coins from grades:</Text>
                <Text>{getCoinsFromGrades()}</Text>
              </View>
              <View style={styles.balanceView}>
                <Text>Total coins from requests:</Text>
                <Text>{getCoinsFromRequests()}</Text>
              </View>
              <View style={styles.balanceView}>
                <Text>Total spendings:</Text>
                <Text>{getTotalSpendings()}</Text>
              </View>
            </>
          )}
        </View>
      </LaCard>
      <LaCard title="Items" actionIcon="arrow-forward">
        <Text style={{ alignSelf: "center", margin: 25 }}>Seems like you don't have anything</Text>
        <LaButton dense={true} onPress={() => navigation.navigate("Store")}>
          Go shopping
        </LaButton>
      </LaCard>
    </ScreenContainer>
  );
};
