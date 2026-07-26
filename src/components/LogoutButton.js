import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation, CommonActions } from '@react-navigation/native';

export default function LogoutButton({ label, style, textStyle }) {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      t('logout') || 'Toka',
      t('logout_confirm') || 'Una uhakika unataka kutoka?',
      [
        { text: t('cancel') || 'Ghairi', style: 'cancel' },
        {
          text: t('yes') || 'Ndio',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await logout();
            setLoading(false);
            // HII NDIO INAYOIFANYA IFANYE KAZI APP NZIMA
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }], // Badilisha kuwa 'Login' kama Auth haipo
              })
            );
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handleLogout} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, textStyle]}>{label || t('logout') || 'Toka'}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});