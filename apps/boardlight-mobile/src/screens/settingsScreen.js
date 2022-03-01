import {
  Avatar,
  Button,
  Caption,
  Dialog,
  Divider,
  Headline,
  Paragraph,
  Portal,
  Subheading,
  Switch,
  Text,
  Title,
  useTheme,
} from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { darkTheme, lightTheme } from "../utils/theme/themes";
import { loadData, saveData } from "../utils/misc/storageUtils";
import { setAdmin, setPredictiveLoad, setTheme } from "../store/slices/settingsSlice";
import { useDispatch, useSelector } from "react-redux";

import BottomSheet from "../components/bottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { RestrictedWrapper } from "../components/restrictedWrapper";
import { ScreenContainer } from "../components/screenContainer";
import { SettingsItem } from "../components/content/settingsItem";
import useLogout from "../hooks/useLogout";

export const SettingsScreen = () => {
  const [showInformation, setShowInformation] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const [showAdminPopup, setShowAdminPopup] = useState(false);

  const logout = useLogout();
  const theme = useTheme();

  const control = useSelector((state) => state.control.value);
  const admin = useSelector((state) => state.settings.admin);
  const predictiveLoad = useSelector((state) => state.settings.predictiveLoad);
  const reduxTheme = useSelector((state) => state.settings.theme);
  const dispatch = useDispatch();

  const bottomSheetRef = useRef();

  useEffect(() => {
    (async () => {
      if (admin) {
        const notFirstRun = await loadData("settings_notFirstAdmin");

        if (notFirstRun === null) {
          await saveData("settings_notFirstAdmin", true);
          setShowAdminPopup(true);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  const styles = StyleSheet.create({
    sheetContainer: {
      flex: 1,
      padding: 20,
    },
    content: {
      paddingTop: 15,
    },
    accountContent: {
      alignItems: "center",
    },
    name: {
      marginBottom: 5,
    },
    devider: {
      width: "100%",
      marginVertical: 5,
    },
  });

  const toggleTheme = () => {
    dispatch(setTheme(reduxTheme.dark ? lightTheme : darkTheme));
  };

  const togglePredictiveLoad = () => {
    dispatch(setPredictiveLoad(!predictiveLoad));
  };

  return (
    <ScreenContainer scrollable={true}>
      <Headline>Beállítások</Headline>
      <View style={styles.content}>
        <View style={styles.accountContent}>
          <Avatar.Text
            size={64}
            label={control.user.name
              .split(" ")
              .map((name) => name[0])
              .join("")}
          />
          <Title style={styles.name}>{control.user.name}</Title>
        </View>
        <SettingsItem
          title="Kilépés"
          right={<Ionicons name="log-out" size={20} color="#f44336" />}
          onPress={() => setConfirmLogout(true)}
          dense={true}
        />
        <SettingsItem
          title="Fiók információk"
          right={<Ionicons name="information-circle" size={20} color="#2196f3" />}
          onPress={() => setShowInformation(true)}
          dense={true}
        />
        <RestrictedWrapper
          permissions={[
            "Products.index",
            "Requests.index",
            "QRCode.view",
            "Users.view",
            "Permissions.view",
          ]}>
          <Divider style={styles.devider} />
          <Caption>Titkos cuccok</Caption>
          <SettingsItem
            title="Admin mód"
            right={
              <Switch
                color={theme.colors.primary}
                value={admin}
                onValueChange={() => dispatch(setAdmin(!admin))}
              />
            }
          />
        </RestrictedWrapper>
        <Divider style={styles.devider} />
        <Caption>Kinézet</Caption>
        <SettingsItem
          title="Sötét téma"
          right={
            <Switch
              color={theme.colors.primary}
              value={reduxTheme.dark}
              onValueChange={() => toggleTheme()}
            />
          }
        />
        <Divider style={styles.devider} />
        <Caption>Kísérleti</Caption>
        <SettingsItem
          title="Prediktív betöltés"
          right={
            <Switch
              color={theme.colors.primary}
              value={predictiveLoad}
              onValueChange={() => togglePredictiveLoad()}
            />
          }
        />
        <Divider style={styles.devider} />
        <Caption>Névjegy</Caption>
        <SettingsItem
          title="Verzió"
          right={<Subheading>{require("../../package.json").version}</Subheading>}
        />
        <SettingsItem
          title="Fejlesztők"
          onPress={() => bottomSheetRef.current.show()}
          right={
            <Ionicons
              style={{ marginRight: 2 }}
              name="people"
              size={20}
              color={theme.colors.text}
            />
          }
        />

        <BottomSheet
          backgroundColor={theme.colors.backdrop}
          sheetBackgroundColor={theme.dark ? "#1e1e1e" : theme.colors.surface}
          radius={theme.roundness}
          ref={bottomSheetRef}
          height={130}>
          <View style={styles.sheetContainer}>
            <Title>Fejlesztők</Title>
            <Text>Mobil app - Ocskó Nándor</Text>
            <Text>Backend - Gyimesi Máté</Text>
          </View>
        </BottomSheet>

        <Portal>
          <Dialog visible={showInformation} dismissable={false}>
            <Dialog.Title>Fiók információk</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Azonosító: {control.user.id}</Paragraph>
              <Paragraph>
                Név: {"\n"}
                {control.user.name}
              </Paragraph>
              <Paragraph>
                E-mail: {"\n"}
                {control.user.email}
              </Paragraph>
              <Paragraph>
                Készült: {"\n"}
                {control.user.created_at.split(".")[0].split("T").join(" ")}
              </Paragraph>
              <Paragraph>
                Utoljára frissítve: {"\n"}
                {control.user.updated_at.split(".")[0].split("T").join(" ")}
              </Paragraph>
              <Paragraph>
                Engedélyek: {"\n"}
                {control.permissions.join(", ")}
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowInformation(false)}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={confirmLogout} dismissable={false}>
            <Dialog.Title>Kilépés</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Biztos ki akarsz lépni?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmLogout(false)}>Mégsem</Button>
              <Button onPress={() => logout(false)}>Igen</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={showAdminPopup} dismissable={false}>
            <Dialog.Title>Üdvözöllek az admin módban</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Az admin módban kezelni tudod a LovassyApp felhasználóit, válaszolni tudsz
                kérelmekre, kezelni tudod a termékeket és a QR kódokat amikkel termékeket lehet
                aktiválni. Jó szórakozást!
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowAdminPopup(false)}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </ScreenContainer>
  );
};
