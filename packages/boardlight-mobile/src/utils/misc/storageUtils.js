import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async (key, state) => {
  AsyncStorage.setItem(key, JSON.stringify(state));
};

export const loadData = async (key) => {
  return JSON.parse(await AsyncStorage.getItem(key));
};

export const deleteData = async (key) => {
  await AsyncStorage.removeItem(key);
};

export const secureSaveData = async (key, state) => {
  SecureStore.setItemAsync(key, JSON.stringify(state));
};

export const secureLoadData = async (key) => {
  return JSON.parse(await SecureStore.getItemAsync(key));
};

export const secureDeleteData = async (key) => {
  SecureStore.deleteItemAsync(key);
};
