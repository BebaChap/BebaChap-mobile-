import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Settings = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const { user, logout, updateUser } = useAuth();
  const { t, language, changeLanguage, isRTL } = useLanguage();
  const textAlign = isRTL ? 'right' : 'left';

  const deleteAccount = () => {
    Alert.alert(t('delete_account'), t('delete_warning'), [
      { text: t('cancel') },
      { text: t('delete'), style: 'destructive', onPress: () => console.log('Delete API') },
    ]);
  };

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logout_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('logout'), style: 'destructive', onPress: () => logout() },
    ]);
  };

  const switchRole = (newRole) => {
    Alert.alert(
      t('change_role'), 
      `${t('switch_to')} ${newRole}?`,
      [
        { text: t('cancel') },
        { text: t('confirm'), onPress: () => updateUser({ ...user, role: newRole }) }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { textAlign }]}>{t('settings')}</Text>
      <Text style={[styles.currentRole, { textAlign }]}>{t('role')}: {user?.role}</Text>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('LanguageSelect')}>
        <Text style={[styles.itemText, { textAlign }]}>🌍 {t('change_language')} ({language.toUpperCase()})</Text>
      </TouchableOpacity>

      <View style={styles.item}>
        <Text style={[styles.itemText, { textAlign, flex: 1 }]}>🔔 {t('notifications')}</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={[styles.itemText, { textAlign }]}>🔒 {t('change_password')}</Text>
      </TouchableOpacity>

      {__DEV__ && (
        <>
          <Text style={[styles.sectionTitle, { textAlign }]}>{t('testing_change_role')}</Text>
          <TouchableOpacity style={styles.item} onPress={() => switchRole('admin')}>
            <Text style={styles.itemText}>👑 {t('admin_app')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => switchRole('driver')}>
            <Text style={styles.itemText}>🚗 {t('driver_app')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => switchRole('vendor')}>
            <Text style={styles.itemText}>🏪 {t('vendor_app')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => switchRole('customer')}>
            <Text style={styles.itemText}>🛍 {t('customer_app')}</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={[styles.item, styles.logout]} onPress={handleLogout}>
        <Text style={[styles.itemText, styles.logoutText, { textAlign }]}>🚪 {t('logout')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, styles.danger]} onPress={deleteAccount}>
        <Text style={[styles.itemText, styles.deleteText, { textAlign }]}>🗑 {t('delete_account')}</Text>
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
  logoutText: { color: '#FF3B30', fontWeight: '600' },
  deleteText: { color: 'red' },
  logout: { marginTop: 20 },
  danger: { marginTop: 10, marginBottom: 40 },
});

export default Settings;