import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const Profile = ({ navigation }) => {
  const auth = useAuth();

  // zuia crash kama auth context haipo
  const user = auth?.user || {};
  const logout = auth?.logout || (() => {});

  const handleLogout = () => {
    Alert.alert('Toka', 'Una uhakika unataka kutoka?', [
      { text: 'Hapana' },
      { text: 'Ndio', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
      </View>
      <Text style={styles.name}>{user?.name || 'User'}</Text>
      <Text style={styles.phone}>{user?.phone || '+255...'}</Text>
      <Text style={styles.role}>Role: {user?.role || 'guest'}</Text>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.menuText}>⚙ Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Help')}>
        <Text style={styles.menuText}>❓ Msaada</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={handleLogout}>
        <Text style={[styles.menuText, { color: 'red' }]}>🚪 Toka</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#007aff', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 15 },
  avatarText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  phone: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 5 },
  role: { fontSize: 14, color: '#007aff', textAlign: 'center', marginTop: 5, marginBottom: 30 },
  menuItem: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuText: { fontSize: 18 },
  logout: { marginTop: 20, borderBottomWidth: 0 },
});

export default Profile;