import asyncstorage from '@react-native-async-storage/async-storage';

export const setitem = async (key, value) => {
  try {
    const jsonvalue = json.stringify(value);
    await asyncstorage.setitem(key, jsonvalue);
  } catch (e) {
    console.error('error saving data', e);
  }
};

export const getitem = async (key) => {
  try {
    const jsonvalue = await asyncstorage.getitem(key);
    return jsonvalue!= null? json.parse(jsonvalue) : null;
  } catch (e) {
    console.error('error reading data', e);
    return null;
  }
};

export const removeitem = async (key) => {
  try {
    await asyncstorage.removeitem(key);
  } catch (e) {
    console.error('error removing data', e);
  }
};

export const clearall = async () => {
  try {
    await asyncstorage.clear();
  } catch (e) {
    console.error('error clearing storage', e);
  }
};

// keys tunazotumia
export const storage_keys = {
  token: '@auth_token',
  user: '@user_data',
  role: '@user_role',
  language: '@app_language'
};