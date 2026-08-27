import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS } from '../../theme/colors';

const Profile = ({ navigation }) => {
  const auth = useAuth();
  const { t } = useLanguage();
  const user = auth?.user || null;
  const role = user?.role || 'customer';
  const logout = auth?.logout || (() => {});

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logout_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('confirm'),
        style: 'destructive',
        onPress: async () => {
          await logout();
        }
      },
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={styles.phone}>{user?.phone || user?.email || '+255...'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{role.toUpperCase()}</Text>
        </View>
      </View>

      <MenuItem icon="settings-outline" label={t('settings')} onPress={() => navigation.navigate('Settings')} />
      <MenuItem icon="help-circle-outline" label={t('help')} onPress={() => navigation.navigate('Help')} />
      <MenuItem icon="notifications-outline" label={t('notifications')} onPress={() => navigation.navigate('Notification')} />
      <MenuItem icon="share-social-outline" label={t('share_app')} onPress={() => navigation.navigate('ShareApp')} />

      {role === 'driver' && (
        <>
          <Text style={styles.sectionTitle}>{t('role_driver')}</Text>
          <MenuItem icon="document-text-outline" label={t('my_documents')} onPress={() => navigation.navigate('DocumentsUploads')} />
          <MenuItem icon="wallet-outline" label={t('my_earnings')} onPress={() => navigation.navigate('DriverEarnings')} />
        </>
      )}

      {role === 'vendor' && (
        <>
          <Text style={styles.sectionTitle}>{t('role_vendor')}</Text>
          <MenuItem icon="storefront-outline" label={t('my_shop')} onPress={() => navigation.navigate('ShopProfile')} />
          <MenuItem icon="cube-outline" label={t('my_products')} onPress={() => navigation.navigate('VendorProducts')} />
        </>
      )}

      <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="red" />
        <Text style={[styles.menuText, { color: 'red', marginLeft: 12 }]}>{t('logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#333" />
    <Text style={styles.menuText}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#ccc" style={{ marginLeft: 'auto' }} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: '#f2f2f2' },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS?.primary || '#007aff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold' },
  phone: { fontSize: 14, color: '#666', marginTop: 4 },
  roleBadge: { backgroundColor: '#E6F0FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  roleText: { fontSize: 11, color: '#007aff', fontWeight: '700' },
  sectionTitle: { fontSize: 13, color: '#999', fontWeight: '600', marginTop: 25, marginLeft: 20, marginBottom: 5, textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 18, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuText: { fontSize: 16, marginLeft: 12 },
  logout: { marginTop: 20, borderBottomWidth: 0 },
});

export default Profile;