import { Headline, Snackbar, Text, useTheme } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BarCodeScanner } from "expo-barcode-scanner";
import BarcodeMask from "react-native-barcode-mask";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { LaButton } from "../../components/content/customized/laButton";
import { ScreenContainer } from "../../components/screenContainer";
import { useIsFocused } from "@react-navigation/core";
import { useBlueboardClient } from "blueboard-client-react";

// TODO: Finish this once theres a backend for it - Possibly with an other screen for confirmation
export const ScanScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [backCamera, setBackCamera] = useState(true);
  const [scanned, setScanned] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarTimeout, setSnackBarTimeout] = useState(30000);

  const isFocused = useIsFocused();

  const client = useBlueboardClient();
  const theme = useTheme();

  const { item, inputState } = route.params;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const styles = StyleSheet.create({
    container: {
      // doing align items here breaks it for some reason, so we do align self
      flex: 1,
      justifyContent: "center",
      height: "100%",
    },
    scanContainer: {
      height: "70%",
      borderRadius: theme.roundness,
      overflow: "hidden",
    },
    scanner: {
      width: "100%",
      height: "100%",
    },
    button: {
      alignSelf: "center",
      margin: 10,
    },
  });

  const toggleBackCamera = () => {
    setBackCamera(!backCamera);
  };

  useEffect(() => {
    setScanned(false);
  }, []);

  const qrCodeScanned = async (data) => {
    setScanned(true);

    setSnackBarOpen(true);
    setSnackBarMessage("Beváltás folyamatban...");
    try {
      await client.inventory.useItem(item.id, data, inputState);
      navigation.navigate("Siker", item);
    } catch (err) {
      setScanned(false);
      setSnackBarMessage("Beváltás sikertelen!");
      setSnackBarTimeout(3000);
    }
  };

  if (hasPermission === null) {
    return (
      <ScreenContainer>
        <View style={{ ...styles.container, alignSelf: "center" }}>
          <Text>Engedély kérése a kamera használatához</Text>
        </View>
      </ScreenContainer>
    );
  }
  if (hasPermission === false) {
    return (
      <ScreenContainer>
        <View style={{ ...styles.container, alignSelf: "center" }}>
          <Text>Kamera használata nem engedélyezett</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <>
      <ScreenContainer>
        <Headline>Beolvasás</Headline>
        <View style={styles.container}>
          <Text style={{ alignSelf: "center", margin: 10 }}>
            Kérlek olvasd be az aktiváló QR kódot
          </Text>
          <View style={styles.scanContainer}>
            {isFocused && (
              <Camera
                style={styles.scanner}
                type={backCamera ? Camera.Constants.Type.back : Camera.Constants.Type.front}
                barCodeScannerSettings={{
                  barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                }}
                onBarCodeScanned={scanned ? null : (res) => qrCodeScanned(res.data)}>
                <BarcodeMask outerMaskOpacity={0} animatedLineHeight={4} height={280} />
              </Camera>
            )}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <LaButton
              onPress={() => {
                navigation.navigate("Megerősítés", item);
              }}
              customStyle={styles.button}>
              <Ionicons name="arrow-back" size={30} color="#fff" />
            </LaButton>
            <LaButton
              onPress={() => {
                toggleBackCamera();
              }}
              customStyle={styles.button}>
              <Ionicons name="camera-reverse" size={30} color="#fff" />
            </LaButton>
          </View>
        </View>
      </ScreenContainer>
      {snackBarOpen && (
        <Snackbar
          visible={snackBarOpen}
          onDismiss={() => {
            setSnackBarOpen(false);
            setSnackBarTimeout(30000);
          }}
          theme={{
            ...theme,
            colors: {
              ...theme.colors,
              surface: theme.colors.text,
              onSurface: theme.dark ? "#171717" : theme.colors.surface,
            },
          }}
          duration={snackBarTimeout}>
          {snackBarMessage}
        </Snackbar>
      )}
    </>
  );
};
