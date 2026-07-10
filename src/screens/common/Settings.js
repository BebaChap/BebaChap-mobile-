import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext'; // ← Hakikisha path iko sahihi

const Settings = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const { user, logout, updateUser } = useAuth(); // ← Chukua kutoka context

  const deleteAccount = () => {
    Alert.alert('Futa Akaunti', 'Hatua hii haiwezi kurudishwa. Una uhakika?', [
      { text: 'Sitisha' },
      { text: 'Futa', style: 'destructive', onPress: () => console.log('Delete API') },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Una uhakika unataka kutoka?', [
      { text: 'Sitisha', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const switchRole = (newRole) => {
    Alert.alert(
      'Badilisha Role', 
      `Unataka kuingia kama ${newRole}?`,
      [
        { text: 'Sitisha' },
        { text: 'Ndiyo', onPress: () => updateUser({ ...user, role: newRole }) }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.currentRole}>Role: {user?.role}</Text>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('LanguageSelect')}>
        <Text style={styles.itemText}>🌍 Badili Lugha</Text>
      </TouchableOpacity>

      <View style={styles.item}>
        <Text style={styles.itemText}>🔔 Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.itemText}>🔒 Badili Nenosiri</Text>
      </TouchableOpacity>

      {__DEV__ && (
        <>
          <Text style={styles.sectionTitle}>Testing: Badilisha Role</Text>
          <TouchableOpacity style={styles.item} onPress={() => switchRole('admin')}>
            <Text style={styles.itemText}>👑 Admin App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => switchRole('driver')}>
            <Text style={styles.itemText}>🚗 Driver App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => switchRole('vendor')}>
            <Text style={styles.itemText}>🏪 Vendor App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => switchRole('customer')}>
            <Text style={styles.itemText}>🛍 Customer App</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={[styles.item, styles.logout]} onPress={handleLogout}>
        <Text style={[styles.itemText, { color: '#FF3B30', fontWeight: '600' }]}>🚪 Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, styles.danger]} onPress={deleteAccount}>
        <Text style={[styles.itemText, { color: 'red' }]}>🗑 Futa Akaunti</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 8 },
  currentRole: { fontSize: 14, color: '#007AFF', paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#666', 
    paddingHorizontal: 20, 
    marginTop: 20, 
    marginBottom: 8 
  },
  item: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingHorizontal: 20 
  },
  itemText: { fontSize: 18 },
  logout: { marginTop: 20 },
  danger: { marginTop: 10, marginBottom: 40 },
});

export default Settings;
