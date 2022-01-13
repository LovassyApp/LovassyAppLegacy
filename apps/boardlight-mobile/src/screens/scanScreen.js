import { Headline, Text, useTheme } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BarCodeScanner } from "expo-barcode-scanner";
import BarcodeMask from "react-native-barcode-mask";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { LaButton } from "../components/content/customized/laButton";
import { ScreenContainer } from "../components/screenContainer";
import { useIsFocused } from "@react-navigation/core";

// TODO: Finish this once theres a backend for it - Possibly with an other screen for confirmation
export const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [backCamera, setBackCamera] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [scanned, setScanned] = useState(false);

  const isFocused = useIsFocused();
  const theme = useTheme();

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

  const qrCodeScanned = (data) => {
    console.log(data);
  };

  if (hasPermission === null) {
    return (
      <ScreenContainer>
        <View style={{ ...styles.container, alignSelf: "center" }}>
          <Text>Requesting for camera permission</Text>
        </View>
      </ScreenContainer>
    );
  }
  if (hasPermission === false) {
    return (
      <ScreenContainer>
        <View style={{ ...styles.container, alignSelf: "center" }}>
          <Text>No access to camera</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Headline>Scanner</Headline>
      <View style={styles.container}>
        <Text style={{ alignSelf: "center", margin: 10 }}>Please scan the activation QR code</Text>
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
        <LaButton
          onPress={() => {
            toggleBackCamera();
          }}
          customStyle={styles.button}>
          <Ionicons name="camera-reverse" size={30} color="#fff" />
        </LaButton>
      </View>
    </ScreenContainer>
  );
};
