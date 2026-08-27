import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function LogoutButton({ label, style, textStyle }) {
  const { logout } = useAuth();
  const { t } = useLanguage();
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
            try {
              await logout();
              // USIFANYE navigation.reset - App.js itabadilisha yenyewe kwenda AuthNavigator
            } finally {
              setLoading(false);
            }
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