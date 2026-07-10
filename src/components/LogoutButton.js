import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LogoutButton({ label = 'Toka', style, textStyle }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Toka',
      'Una uhakika unataka kutoka?',
      [
        { text: 'Ghairi', style: 'cancel' },
        {
          text: 'Ndio',
          style: 'destructive',
          onPress: async () => {
            await logout(); // inafuta user na inakurudisha Login
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handleLogout}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});