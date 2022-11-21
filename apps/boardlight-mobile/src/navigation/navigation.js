import { ConfirmScreen } from "../screens/activation/confirmScreen";
import { ContributoprsScreen } from "../screens/settings/contributorsScreen";
import { HomeScreen } from "../screens/homeScreen";
import { InventoryScreen } from "../screens/activation/inventoryScreen";
import { Ionicons } from "@expo/vector-icons";
import { KretaScreen } from "../screens/kretaScreen";
import { LoginScreen } from "../screens/loginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { ProductsScreen } from "../screens/admin/productsScreen";
import { QrCodesScreen } from "../screens/admin/qrCodesScreen";
import React from "react";
import { RegisterScreen } from "../screens/registerScreen";
import { RequestsScreen } from "../screens/admin/requestsScreen";
import { ScanScreen } from "../screens/activation/scanScreen";
import { SettingsScreen } from "../screens/settings/settingsScreen";
import { StoreScreen } from "../screens/storeScreen";
import { SuccessScreen } from "../screens/activation/successScreen";
import { UsersScreen } from "../screens/admin/usersScreen";
import { View } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { useTheme } from "react-native-paper";
import { useUser } from "../hooks/controlHooks";
import { PrivacyPolicyScreen } from "../screens/settings/privacyPolicyScreen";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const theme = useTheme();

  const admin = useSelector((state) => state.settings.admin);
  const user = useUser();

  if (admin) {
    return (
      <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Beállítások"
          screenOptions={{ safeAreaInsets: { top: 0 } }}
          barStyle={{
            backgroundColor: theme.colors.background,
            elevation: 0,
            // marginTop: -34, //TODO: Fix this, this is pretty ugly
          }}
          activeColor={theme.colors.primary}>
          <Tab.Screen
            name="Felhasználók"
            options={{
              tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
            }}
            component={UsersScreen}
          />
          <Tab.Screen
            name="Kérelmek"
            options={{
              tabBarIcon: ({ color }) => <Ionicons name="mail" size={24} color={color} />,
            }}
            component={RequestsScreen}
          />
          <Tab.Screen
            name="Termékek"
            options={{
              tabBarIcon: ({ color }) => <Ionicons name="pricetags" size={24} color={color} />,
            }}
            component={ProductsScreen}
          />
          <Tab.Screen
            name="QR Kódok"
            options={{
              tabBarIcon: ({ color }) => <Ionicons name="layers" size={24} color={color} />,
            }}
            component={QrCodesScreen}
          />
          <Tab.Screen
            name="Beállítások"
            options={{
              tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
            }}
            component={SettingsScreen}
          />
        </Tab.Navigator>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Kezdőlap"
        barStyle={{
          backgroundColor: theme.colors.background,
          elevation: 0,
          // marginTop: -34, //TODO: Fix this, this is pretty ugly
        }}
        activeColor={theme.colors.primary}>
        <Tab.Screen
          name="Kezdőlap"
          options={{
            tabBarBadge: `$${user.balance}`,
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
          component={HomeScreen}
        />
        <Tab.Screen
          name="Kréta"
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} />,
          }}
          component={KretaScreen}
        />
        <Tab.Screen
          name="Kincstár"
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="file-tray-full" size={24} color={color} />,
          }}
          component={ActivationNavigation}
        />
        <Tab.Screen
          name="Áruház"
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
          }}
          component={StoreScreen}
        />
        <Tab.Screen
          name="Beállítások"
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
          }}
          component={SettingsNavigation}
        />
      </Tab.Navigator>
    </View>
  );
};

const LoginNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const ActivationNavigation = () => {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Kezdőlap"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Kezdőlap" component={InventoryScreen} />
        <Stack.Screen name="Megerősítés" component={ConfirmScreen} />
        <Stack.Screen name="Beolvasás" component={ScanScreen} />
        <Stack.Screen name="Siker" component={SuccessScreen} />
      </Stack.Navigator>
    </View>
  );
};

const SettingsNavigation = () => {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Kezdőlap"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Kezdőlap" component={SettingsScreen} />
        <Stack.Screen name="Fejlesztők" component={ContributoprsScreen} />
        <Stack.Screen name="AdatvédelmiTájékoztató" component={PrivacyPolicyScreen} />
      </Stack.Navigator>
    </View>
  );
};

export const NavigationDecider = () => {
  const token = useSelector((state) => state.token.value);

  return (
    <NavigationContainer>{token ? <MainNavigation /> : <LoginNavigation />}</NavigationContainer>
  );
};
