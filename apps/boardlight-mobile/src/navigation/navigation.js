import { HomeScreen } from "../screens/homeScreen";
import { Ionicons } from "@expo/vector-icons";
import { KretaScreen } from "../screens/kretaScreen";
import { LoginScreen } from "../screens/loginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { ProductsScreen } from "../screens/admin/productsScreen";
import { QrCodesScreen } from "../screens/admin/qrCodesScreen";
import React from "react";
import { RegisterScreen } from "../screens/registerScreen";
import { RequestsScreen } from "../screens/admin/requestsScreen";
import { ScanScreen } from "../screens/scanScreen";
import { SettingsScreen } from "../screens/settingsScreen";
import { StoreScreen } from "../screens/storeScreen";
import { UsersScreen } from "../screens/admin/usersScreen";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { useTheme } from "react-native-paper";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const theme = useTheme();

  const admin = useSelector((state) => state.settings.admin);

  //* For testing the scanner
  // return (
  //   <Tab.Navigator
  //     barStyle={{
  //       backgroundColor: theme.colors.background,
  //       elevation: 0,
  //     }}
  //     activeColor={theme.colors.primary}
  //   >
  //     <Tab.Screen
  //       name="Home"
  //       options={{
  //         tabBarIcon: ({ color }) => (
  //           <Ionicons name="home" size={24} color={color} />
  //         ),
  //       }}
  //       component={HomeScreen}
  //     />
  //     <Tab.Screen
  //       name="Scan"
  //       options={{
  //         tabBarIcon: ({ color }) => (
  //           <Ionicons name="qr-code" size={24} color={color} />
  //         ),
  //       }}
  //       component={ScanScreen}
  //     />
  //   </Tab.Navigator>
  // );

  if (admin) {
    return (
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
    );
  }

  return (
    <Tab.Navigator
      barStyle={{
        backgroundColor: theme.colors.background,
        elevation: 0,
        // marginTop: -34, //TODO: Fix this, this is pretty ugly
      }}
      activeColor={theme.colors.primary}>
      <Tab.Screen
        name="Kezdőlap"
        options={{
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
        name="Beolvasás"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="qr-code" size={24} color={color} />,
        }}
        component={ScanScreen}
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
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

const LoginNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export const NavigationDecider = () => {
  const token = useSelector((state) => state.token.value);

  //* For testing the scanner
  // return (
  //   <NavigationContainer>
  //     <MainNavigation />
  //   </NavigationContainer>
  // );

  return (
    <NavigationContainer>{token ? <MainNavigation /> : <LoginNavigation />}</NavigationContainer>
  );
};
