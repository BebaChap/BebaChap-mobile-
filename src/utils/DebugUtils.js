import AsyncStorage from '@react-native-async-storage/async-storage';

// Ina-log AsyncStorage yote
export const logAllStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);
    console.log("====== ASYNC STORAGE YOTE ======");
    stores.forEach(([key, value]) => {
      console.log(`${key} : ${value}`);
    });
    console.log("================================");
    return stores;
  } catch (e) {
    console.log("Error reading storage", e);
  }
};

// Inafuta kila kitu - kwa ajili ya test ya first time
export const clearAllStorage = async () => {
  await AsyncStorage.clear();
  console.log("STORAGE IMEFUTWA!");
};

// Ina-log navigation state
export const logNavigationState = (navigation) => {
  const state = navigation.getState();
  console.log("====== NAVIGATION STATE ======");
  console.log(JSON.stringify(state, null, 2));
  console.log("==============================");
};