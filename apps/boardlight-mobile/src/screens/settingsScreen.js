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
import { setPredictiveLoad, setTheme } from "../store/slices/settingsSlice";
import { useDispatch, useSelector } from "react-redux";

import BottomSheet from "../components/bottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../components/screenContainer";
import { SettingsItem } from "../components/content/settingsItem";
import { setAdmin } from "../store/slices/adminSlice";
import useLogout from "../hooks/useLogout";

export const SettingsScreen = () => {
  const [showInformation, setShowInformation] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const [showAdminPopup, setShowAdminPopup] = useState(false);

  const logout = useLogout();
  const theme = useTheme();

  const control = useSelector((state) => state.control.value);
  const admin = useSelector((state) => state.admin.value);
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
  });

  const toggleTheme = () => {
    console.log(lightTheme);
    dispatch(setTheme(reduxTheme.dark ? lightTheme : darkTheme));
  };

  const togglePredictiveLoad = () => {
    dispatch(setPredictiveLoad(!predictiveLoad));
  };

  return (
    <ScreenContainer scrollable={true}>
      <Headline>Settings</Headline>
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
          title="Log out"
          right={<Ionicons name="log-out" size={20} color="#f44336" />}
          onPress={() => setConfirmLogout(true)}
          dense={true}
        />
        <SettingsItem
          title="Account information"
          right={<Ionicons name="information-circle" size={20} color="#2196f3" />}
          onPress={() => setShowInformation(true)}
          dense={true}
        />
        <Divider style={{ width: "100%", marginVertical: 5 }} />
        <Caption>Secret stuff</Caption>
        <SettingsItem
          title="Admin mode"
          right={
            <Switch
              color={theme.colors.primary}
              value={admin}
              onValueChange={() => dispatch(setAdmin(!admin))}
            />
          }
        />
        <Divider style={{ width: "100%", marginVertical: 5 }} />
        <Caption>Appearance</Caption>
        <SettingsItem
          title="Dark theme"
          right={
            <Switch
              color={theme.colors.primary}
              value={reduxTheme.dark}
              onValueChange={() => toggleTheme()}
            />
          }
        />
        <Divider style={{ width: "100%", marginVertical: 5 }} />
        <Caption>Experimental</Caption>
        <SettingsItem
          title="Predictive loading"
          right={
            <Switch
              color={theme.colors.primary}
              value={predictiveLoad}
              onValueChange={() => togglePredictiveLoad()}
            />
          }
        />
        <Divider style={{ width: "100%", marginVertical: 5 }} />
        <Caption>About</Caption>
        <SettingsItem
          title="Version"
          right={<Subheading>{require("../../package.json").version}</Subheading>}
        />
        <SettingsItem
          title="Contributors"
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
          sheetBackgroundColor={reduxTheme === lightTheme ? theme.colors.surface : "#1e1e1e"}
          radius={theme.roundness}
          ref={bottomSheetRef}
          height={130}>
          <View style={styles.sheetContainer}>
            <Title>Contributors</Title>
            <Text>Mobile app - Ocskó Nándor</Text>
            <Text>Backend - Gyimesi Máté</Text>
          </View>
        </BottomSheet>

        <Portal>
          <Dialog visible={showInformation} dismissable={false}>
            <Dialog.Title>Account information</Dialog.Title>
            <Dialog.Content>
              <Paragraph>User ID: {control.user.id}</Paragraph>
              <Paragraph>
                Name: {"\n"}
                {control.user.name}
              </Paragraph>
              <Paragraph>
                Email: {"\n"}
                {control.user.email}
              </Paragraph>
              <Paragraph>
                Created at: {"\n"}
                {control.user.created_at.split(".")[0].split("T").join(" ")}
              </Paragraph>
              <Paragraph>
                Last updated at: {"\n"}
                {control.user.updated_at.split(".")[0].split("T").join(" ")}
              </Paragraph>
              <Paragraph>
                Permissions: {"\n"}
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
            <Dialog.Title>Log out</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Are you sure you want to log out?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmLogout(false)}>Cancel</Button>
              <Button onPress={() => logout(false)}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={showAdminPopup} dismissable={false}>
            <Dialog.Title>Welocome to the admin panel!</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                In the admin panel you are able to manage all the users of LovassyApp, answer
                requests, add or edit buyable products and manage the qr codes used or activating
                products. Have fun!
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
