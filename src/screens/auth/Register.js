import { useLanguage } from '../../contexts/LanguageContext';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';

const ROLES = [
  { key: 'customer', label: 'Mteja', emoji: '👤', labelKey: 'role_customer' },
  { key: 'driver', label: 'Dereva', emoji: '🏍', labelKey: 'role_driver' },
  { key: 'vendor', label: 'Muuzaji / Duka', emoji: '🛒', labelKey: 'role_vendor' },
  { key: 'garage', label: 'Fundi Gereji', emoji: '🔧', labelKey: 'role_garage' },
];

const VENDOR_TYPES = [
  { key: 'shop', label: 'Duka / Supermarket', emoji: '🛒', labelKey: 'shop' },
  { key: 'restaurant', label: 'Restaurant / Fast Food', emoji: '🍽', labelKey: 'restaurant' },
];

export default function Register({ navigation, route }) {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nida, setNida] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [tin, setTin] = useState('');
  const [roleIndex, setRoleIndex] = useState(() => {
    const init = route.params?.role;
    // ===== FIX YA USALAMA: Admin hawezi kujisajili hapa =====
    if(!init || init === 'admin') return 0; // Lazimisha awe customer
    const idx = ROLES.findIndex(r => r.key === init);
    return idx >=0? idx : 0;
  });
  const [vendorType, setVendorType] = useState('shop');
  const [docs, setDocs] = useState({});
  const [loading, setLoading] = useState(false);
  const { registerBusiness } = useAuth();

  const current = ROLES[roleIndex];

  const pickDoc = async (type) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert(t('permission'), t('allow_photo'));
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
    if (!res.canceled) setDocs(prev => ({...prev, [type]: res.assets[0].uri}));
  };

  const handleRegister = async () => {
    if (name.trim().length < 3) return Alert.alert(t('error'), t('fill_full_name'));
    const cleanPhone = `+255${phone.replace(/\D/g,'').replace(/^0+/,'').replace(/^255/,'')}`;

    // MTEJA - SASA HAKUNA OTP, ANAFUNGUKA MOJA KWA MOJA
    if (current.key === 'customer') {
      const raw = phone.replace(/\D/g,'').replace(/^0+/, '').replace(/^255/,'');
      if (raw.length!== 9) return Alert.alert(t('error'), t('enter_valid_phone'));

      setLoading(true);
      try {
        const payload = {
          name,
          phone: cleanPhone,
          role: 'customer', // Hii itatafsiriwa kama user_type = customer kwenye AuthContext
          vendorType: 'shop',
        };
        console.log("REGISTER PAYLOAD CUSTOMER:", payload);
        const res = await registerBusiness(payload);
        console.log("REGISTER RESULT:", res);

        if (res.success) {
          console.log("Amefunguka moja kwa moja kama", res.user.role);
          Alert.alert(t('congrats'), `${t('welcome')} ${res.user.role}!`);
        } else {
          Alert.alert(t('failed'), res.message);
        }
      } catch(e){
        console.log(e);
        Alert.alert(t('error'), t('network_error'));
      } finally { setLoading(false); }
      return;
    }

    // BIASHARA - HAKUNA OTP
    if (!email.includes('@')) return Alert.alert(t('error'), t('invalid_email'));
    if (nida.length < 15) return Alert.alert(t('error'), t('invalid_nida'));
    if (current.key === 'driver' && licenseNo.length < 5) return Alert.alert(t('error'), t('enter_license'));
    if ((current.key === 'vendor' || current.key === 'garage') && tin.length < 5) return Alert.alert(t('error'), t('enter_tin'));
    if (!docs.nidaFile) return Alert.alert(t('error'), t('attach_nida'));

    setLoading(true);
    try {
      // ===== FIX YA USALAMA: Hakikisha role sio admin =====
      const safeRole = current.key === 'admin'? 'customer' : current.key;

      const payload = {
        name, email: email.trim(), phone: cleanPhone,
        role: safeRole,
        vendorType: safeRole === 'vendor'? vendorType : 'shop',
        nida, licenseNo, tin, documents: docs
      };
      console.log("REGISTER PAYLOAD:", payload);

      const res = await registerBusiness(payload);
      console.log("REGISTER RESULT:", res);

      if (res.success) {
        console.log("Amefunguka moja kwa moja kama", res.user.role);
        Alert.alert(t('congrats'), `${t('welcome')} ${res.user.role}!`);
      } else {
        Alert.alert(t('failed'), res.message);
      }
    } catch(e){
      console.log(e);
      Alert.alert(t('error'), t('network_error'));
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:50}}>
      <Text style={styles.title}>{t('register_title')}</Text>
      <Text style={styles.label}>{t('account_type')}</Text>
      <TouchableOpacity style={styles.roleBox} onPress={() => setRoleIndex((i) => (i+1)%ROLES.length)}>
        <Text style={styles.emoji}>{current.emoji}</Text>
        <Text style={styles.roleText}>{t(current.labelKey)}</Text>
        <Text style={styles.badge}>{roleIndex+1}/{ROLES.length} • {t('tap_to_change')}</Text>
      </TouchableOpacity>
      {current.key === 'vendor' && (
        <>
          <Text style={styles.label}>{t('business_type')}</Text>
          <View style={styles.vendorTypeRow}>
            {VENDOR_TYPES.map(vt => (
              <TouchableOpacity key={vt.key} style={[styles.typeCard, vendorType === vt.key && styles.typeCardActive]} onPress={() => setVendorType(vt.key)}>
                <Text style={styles.typeEmoji}>{vt.emoji}</Text>
                <Text style={[styles.typeLabel, vendorType === vt.key && styles.typeLabelActive]}>{t(vt.labelKey)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      <Text style={styles.label}>{t('full_name')}</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={t('full_name_placeholder')} />
      {current.key === 'customer'? (
        <>
          <Text style={styles.label}>{t('phone_number')}</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="712345678" keyboardType="phone-pad" />
        </>
      ) : (
        <>
          <Text style={styles.label}>{t('business_email')}</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="duka@gmail.com" keyboardType="email-address" autoCapitalize="none" />
          <Text style={styles.label}>{t('phone')}</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="712345678" keyboardType="phone-pad" />
          <Text style={styles.label}>{t('nida_number')}</Text>
          <TextInput style={styles.input} value={nida} onChangeText={setNida} placeholder="1990XXXXXXXXXXXXXXX" keyboardType="number-pad" />
          {current.key === 'driver' && <><Text style={styles.label}>{t('license_number')}</Text><TextInput style={styles.input} value={licenseNo} onChangeText={setLicenseNo} placeholder="4001234567" /></>}
          {(current.key === 'vendor' || current.key === 'garage') && <><Text style={styles.label}>{t('tin_number')}</Text><TextInput style={styles.input} value={tin} onChangeText={setTin} placeholder="123-456-789" /></>}
          <Text style={styles.section}>{t('attach_documents')}</Text>
          <TouchableOpacity style={styles.docBtn} onPress={() => pickDoc('nidaFile')}><Text>{docs.nidaFile? `✅ ${t('nida_attached')}` : `📎 ${t('upload_nida')}`}</Text></TouchableOpacity>
          {current.key === 'driver' && <TouchableOpacity style={styles.docBtn} onPress={() => pickDoc('licenseFile')}><Text>{docs.licenseFile? `✅ ${t('license_attached')}` : `📎 ${t('upload_license')}`}</Text></TouchableOpacity>}
          {(current.key === 'vendor' || current.key === 'garage') && <TouchableOpacity style={styles.docBtn} onPress={() => pickDoc('tinFile')}><Text>{docs.tinFile? `✅ ${t('tin_attached')}` : `📎 ${t('upload_tin')}`}</Text></TouchableOpacity>}
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>{current.key==='customer'? 'Endelea' : `${t('open_account')} →`}</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#264d35',padding:20,paddingTop:50},
  title:{fontSize:26,fontWeight:'bold',marginBottom:10, color:'#fff'},
  label:{fontWeight:'600',marginTop:15,marginBottom:6, color:'#fff'},
  input:{borderWidth:1,borderColor:'#ddd',borderRadius:10,padding:14,backgroundColor:'#ffffff'},
  roleBox:{flexDirection:'row',alignItems:'center',padding:14,borderWidth:1.5,borderColor:'#007aff',borderRadius:12,backgroundColor:'#e3f2fd'},
  emoji:{fontSize:24,marginRight:10}, roleText:{fontWeight:'700',flex:1}, badge:{fontSize:10,color:'#007aff'},
  vendorTypeRow:{flexDirection:'row',gap:10,marginTop:5},
  typeCard:{flex:1,borderWidth:2,borderColor:'#ddd',borderRadius:12,padding:12,alignItems:'center',backgroundColor:'#f9f9f9'},
  typeCardActive:{borderColor:'#007AFF',backgroundColor:'#E8F0FE'},
  typeEmoji:{fontSize:28,marginBottom:4},
  typeLabel:{fontSize:12,fontWeight:'600',textAlign:'center',color:'#666'},
  typeLabelActive:{color:'#007AFF'},
  section:{marginTop:20,fontWeight:'800',fontSize:15, color:'#fff'},
  docBtn:{borderWidth:1,borderColor:'#ccc',borderStyle:'dashed',padding:14,borderRadius:10,marginTop:8,alignItems:'center', backgroundColor:'#fff'},
  button:{backgroundColor:'#007aff',padding:16,borderRadius:12,marginTop:30,alignItems:'center'},
  btnText:{color:'#fff',fontWeight:'bold',fontSize:16}
});