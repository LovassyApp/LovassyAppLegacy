/* import { HomeScreen } from '../screens/homeScreen';
import { Ionicons } from '@expo/vector-icons';
import { KretaScreen } from '../screens/kretaScreen';
import { LoginScreen } from '../screens/loginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { ProductsScreen } from '../screens/admin/productsScreen';
import { QrCodesScreen } from '../screens/admin/qrCodesScreen';
import React from 'react';
import { RegisterScreen } from '../screens/registerScreen';
import { RequestsScreen } from '../screens/admin/requestsScreen';
import { ScanScreen } from '../screens/scanScreen';
import { SettingsScreen } from '../screens/settingsScreen';
import { StoreScreen } from '../screens/storeScreen';
import { UsersScreen } from '../screens/admin/usersScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { RestrictedWrapper } from '../components/restrictedWrapper';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainNavigation = () => {
    const theme = useTheme();
    const admin = useSelector((state) => state.admin.value);

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
                initialRouteName="Settings"
                barStyle={{
                    backgroundColor: theme.colors.background,
                    elevation: 0,
                    // marginTop: -34, //TODO: Fix this, this is pretty ugly
                }}
                activeColor={theme.colors.primary}
            >
                <RestrictedWrapper permission="Users.view">
                    <Tab.Screen
                        name="Users"
                        options={{
                            tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
                        }}
                        component={UsersScreen}
                    />
                </RestrictedWrapper>
                <Tab.Screen
                    name="Requests"
                    options={{
                        tabBarIcon: ({ color }) => <Ionicons name="mail" size={24} color={color} />,
                    }}
                    component={RequestsScreen}
                />
                <RestrictedWrapper permissions={['Products.add', 'Products.update', 'Products.delete']}>
                    <Tab.Screen
                        name="Products"
                        options={{
                            tabBarIcon: ({ color }) => <Ionicons name="pricetags" size={24} color={color} />,
                        }}
                        component={ProductsScreen}
                    />
                </RestrictedWrapper>
                <RestrictedWrapper permissions={['QRCode.add', 'QRCode.delete']}>
                    <Tab.Screen
                        name="QR Codes"
                        options={{
                            tabBarIcon: ({ color }) => <Ionicons name="layers" size={24} color={color} />,
                        }}
                        component={QrCodesScreen}
                    />
                </RestrictedWrapper>
                <Tab.Screen
                    name="Settings"
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
            activeColor={theme.colors.primary}
        >
            <RestrictedWrapper permission="General.home">
                <Tab.Screen
                    name="Home"
                    options={{
                        tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
                    }}
                    component={HomeScreen}
                />
            </RestrictedWrapper>
            <RestrictedWrapper permission="General.grades">
                <Tab.Screen
                    name="Kreta"
                    options={{
                        tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} />,
                    }}
                    component={KretaScreen}
                />
            </RestrictedWrapper>
            //TODO: Product use permission validation once that exists
            <Tab.Screen
                name="Scan"
                options={{
                    tabBarIcon: ({ color }) => <Ionicons name="qr-code" size={24} color={color} />,
                }}
                component={ScanScreen}
            />
            <RestrictedWrapper permission="Products.show">
                <Tab.Screen
                    name="Store"
                    options={{
                        tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
                    }}
                    component={StoreScreen}
                />
            </RestrictedWrapper>
            <Tab.Screen
                name="Settings"
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
            }}
        >
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

    return <NavigationContainer>{token ? <MainNavigation /> : <LoginNavigation />}</NavigationContainer>;
};
 */
