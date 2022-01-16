import { Button, Divider, Headline, Subheading, Text } from 'react-native-paper';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FullScreenLoading } from '../components/fullScreenLoading';
import { LaButton } from '../components/content/customized/laButton';
import { LaCard } from '../components/content/laCard';
import { ScreenContainer } from '../components/screenContainer';
import { fetchLolo } from '../utils/api/loloUtils';
import { useSelector, useDispatch } from 'react-redux';
import { useBlueboardClient } from 'blueboard-client-react';
import { BlueboardLoloReason } from 'blueboard-client';

export const HomeScreen = ({ navigation }) => {
    //* Useless chart shit that the library was unable to comprehend, maybe one day

    // const chartConfig = {
    //   backgroundGradientFrom: "#1E2923",
    //   backgroundGradientFromOpacity: 0,
    //   backgroundGradientTo: "#08130D",
    //   backgroundGradientToOpacity: 0.5,
    //   color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    //   strokeWidth: 2, // optional, default 3
    //   barPercentage: 0.5,
    //   useShadowColorFromDataset: false, // optional
    // };

    // const getColor = () => {
    //   return "#" + Math.floor(Math.random() * 16777215).toString(16);
    // };

    // const getProcessedData = () => {
    //   var reasons = [];
    //   var colors = [];

    //   var res = [];

    //   for (const coin of coins) {
    //     if (!reasons.includes(coin.reason.type)) {
    //       reasons.push(coin.reason.type);

    //       var color = getColor();

    //       while (color === theme.colors.surface || colors.includes(color)) {
    //         color = getColor();
    //       }

    //       colors.push(color);

    //       res.push({
    //         name: coin.reason.message,
    //         value: 1,
    //         color: color,
    //         legendFontColor: theme.colors.text,
    //         legendFontSize: 12,
    //       });
    //     } else {
    //       const index = res.findIndex(
    //         (element) => element.name === coin.reason.message
    //       );

    //       if (index != -1) {
    //         res[index].value++;
    //       }
    //     }
    //   }

    //   return res;
    // };

    const [loading, setLoading] = useState(false);

    const token = useSelector((state) => state.token.value);

    const dispatch = useDispatch();

    const bal = useSelector((state) => state.lolo.bal);
    const coins = useSelector((state) => state.lolo.coins);
    const client = useBlueboardClient();

    const styles = StyleSheet.create({
        balanceContainer: {
            alignItems: 'center',
        },
        balanceView: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 5,
        },
    });

    const tryAgain = () => {
        setLoading(true);

        client.lolo
            .get()
            .then((res) => {
                dispatch({
                    type: 'lolo/setLolo',
                    payload: { bal: res.balance, coins: res.coins },
                });
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    const getCoinsFromGrades = () => {
        var res = 0;

        for (const coin of coins) {
            if (coin.reason === BlueboardLoloReason.FromFive || coin.reason === BlueboardLoloReason.FromFour) {
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

    const getTotalSpendings = () => {
        var res = 0;

        for (const coin of coins) {
            if (coin.isSpent === 1) {
                res++;
            }
        }

        return res;
    };

    if (loading) {
        return <FullScreenLoading />;
    }

    return (
        <ScreenContainer>
            <Headline>Home</Headline>
            <LaCard title="Balance" actionIcon="arrow-forward">
                <View style={styles.balanceContainer}>
                    {bal === null ? (
                        <>
                            <Text style={{ alignItems: 'center', margin: 25 }}>Unable to fetch balance</Text>
                            <Button onPress={() => tryAgain()}>Try Again</Button>
                        </>
                    ) : (
                        <View style={styles.balanceView}>
                            <Subheading>Current balance:</Subheading>
                            <Subheading>{bal}</Subheading>
                        </View>
                    )}

                    {coins && (
                        <>
                            <Divider style={{ width: '100%', marginVertical: 5 }} />
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
                <Text style={{ alignSelf: 'center', margin: 25 }}>Seems like you don't have anything</Text>
                <LaButton dense={true} onPress={() => navigation.navigate('Store')}>
                    Go shopping
                </LaButton>
            </LaCard>
        </ScreenContainer>
    );
};
