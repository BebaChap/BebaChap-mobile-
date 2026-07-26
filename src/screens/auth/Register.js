import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';

const ROLES = [
  { key: 'customer', label: 'Mteja', emoji: '👤' },
  { key: 'driver', label: 'Dereva', emoji: '🏍' },
  { key: 'vendor', label: 'Muuzaji / Duka', emoji: '🛒' },
  { key: 'garage', label: 'Fundi Gereji', emoji: '🔧' },
];

const VENDOR_TYPES = [
  { key: 'shop', label: 'Duka / Supermarket', emoji: '🛒' },
  { key: 'restaurant', label: 'Restaurant / Fast Food', emoji: '🍽' },
];

export default function Register({ navigation, route }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nida, setNida] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [tin, setTin] = useState('');
  const [roleIndex, setRoleIndex] = useState(() => {
    const init = route.params?.role;
    if(init === 'admin') return 0;
    const idx = ROLES.findIndex(r => r.key === init);
    return idx >=0? idx : 0;
  });
  const [vendorType, setVendorType] = useState('shop');
  const [docs, setDocs] = useState({});
  const [loading, setLoading] = useState(false);
  const { registerBusiness, sendOtp } = useAuth();

  const current = ROLES[roleIndex];

  const pickDoc = async (type) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Ruhusa', 'Ruhusu kuchagua picha');
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
    if (!res.canceled) setDocs(prev => ({...prev, [type]: res.assets[0].uri}));
  };

  const handleRegister = async () => {
    if (name.trim().length < 3) return Alert.alert('Kosa','Jaza jina kamili');
    const cleanPhone = `+255${phone.replace(/\D/g,'').replace(/^0+/,'').replace(/^255/,'')}`;

    // MTEJA - BADO ANA OTP
    if (current.key === 'customer') {
      const raw = phone.replace(/\D/g,'').replace(/^0+/, '').replace(/^255/,'');
      if (raw.length!== 9) return Alert.alert('Kosa','Weka namba sahihi');
      setLoading(true);
      try {
        const fullPhone = `+255${raw}`;
        const otpRes = await sendOtp(fullPhone);
        if(otpRes.success){
          navigation.navigate('OTP', { name, phone: fullPhone, role: 'customer', vendorType: 'shop', isLogin: false });
        } else {
          Alert.alert('Kosa', otpRes.message);
        }
      } finally { setLoading(false); }
      return;
    }

    // BIASHARA - HAKUNA OTP, INAFUNGUKA MOJA KWA MOJA
    if (!email.includes('@')) return Alert.alert('Kosa','Email si sahihi');
    if (nida.length < 15) return Alert.alert('Kosa','NIDA namba sio sahihi');
    if (current.key === 'driver' && licenseNo.length < 5) return Alert.alert('Kosa','Weka leseni');
    if ((current.key === 'vendor' || current.key === 'garage') && tin.length < 5) return Alert.alert('Kosa','Weka TIN');
    if (!docs.nidaFile) return Alert.alert('Kosa','Ambatisha NIDA');

    setLoading(true);
    try {
      const payload = {
        name, email: email.trim(), phone: cleanPhone,
        role: current.key,
        vendorType: current.key === 'vendor'? vendorType : 'shop',
        nida, licenseNo, tin, documents: docs
      };
      console.log("REGISTER PAYLOAD:", payload);

      const res = await registerBusiness(payload);
      console.log("REGISTER RESULT:", res);

      if (res.success) {
        // USIENDE OTP TENA - IMEFUNGUKA MOJA KWA MOJA
        console.log("Amefunguka moja kwa moja kama", res.user.role);
        Alert.alert('Hongera', `Karibu ${res.user.role}!`);
        // AppNavigator atamfungua mwenyewe VendorApp/DriverApp kwa sababu setUser imeshatokea
      } else {
        Alert.alert('Imeshindikana', res.message);
      }
    } catch(e){
      console.log(e);
      Alert.alert('Kosa','Mtandao');
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:50}}>
      <Text style={styles.title}>Jisajili</Text>
      <Text style={styles.label}>Aina ya Akaunti</Text>
      <TouchableOpacity style={styles.roleBox} onPress={() => setRoleIndex((i) => (i+1)%ROLES.length)}>
        <Text style={styles.emoji}>{current.emoji}</Text>
        <Text style={styles.roleText}>{current.label}</Text>
        <Text style={styles.badge}>{roleIndex+1}/{ROLES.length} • Bonyeza kubadilisha</Text>
      </TouchableOpacity>
      {current.key === 'vendor' && (
        <>
          <Text style={styles.label}>Aina ya Biashara</Text>
          <View style={styles.vendorTypeRow}>
            {VENDOR_TYPES.map(vt => (
              <TouchableOpacity key={vt.key} style={[styles.typeCard, vendorType === vt.key && styles.typeCardActive]} onPress={() => setVendorType(vt.key)}>
                <Text style={styles.typeEmoji}>{vt.emoji}</Text>
                <Text style={[styles.typeLabel, vendorType === vt.key && styles.typeLabelActive]}>{vt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      <Text style={styles.label}>Jina Kamili</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Juma Mzuri" />
      {current.key === 'customer'? (
        <>
          <Text style={styles.label}>Namba ya Simu</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="712345678" keyboardType="phone-pad" />
        </>
      ) : (
        <>
          <Text style={styles.label}>Email ya Biashara</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="duka@gmail.com" keyboardType="email-address" autoCapitalize="none" />
          <Text style={styles.label}>Simu</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="712345678" keyboardType="phone-pad" />
          <Text style={styles.label}>NIDA Namba</Text>
          <TextInput style={styles.input} value={nida} onChangeText={setNida} placeholder="1990XXXXXXXXXXXXXXX" keyboardType="number-pad" />
          {current.key === 'driver' && <><Text style={styles.label}>Leseni Namba</Text><TextInput style={styles.input} value={licenseNo} onChangeText={setLicenseNo} placeholder="4001234567" /></>}
          {(current.key === 'vendor' || current.key === 'garage') && <><Text style={styles.label}>TIN Namba</Text><TextInput style={styles.input} value={tin} onChangeText={setTin} placeholder="123-456-789" /></>}
          <Text style={styles.section}>Ambatisha Nyaraka</Text>
          <TouchableOpacity style={styles.docBtn} onPress={() => pickDoc('nidaFile')}><Text>{docs.nidaFile? '✅ NIDA Imeambatishwa' : '📎 Pakia Kitambulisho NIDA'}</Text></TouchableOpacity>
          {current.key === 'driver' && <TouchableOpacity style={styles.docBtn} onPress={() => pickDoc('licenseFile')}><Text>{docs.licenseFile? '✅ Leseni Imeambatishwa' : '📎 Pakia Leseni ya Udereva'}</Text></TouchableOpacity>}
          {(current.key === 'vendor' || current.key === 'garage') && <TouchableOpacity style={styles.docBtn} onPress={() => pickDoc('tinFile')}><Text>{docs.tinFile? '✅ TIN Imeambatishwa' : '📎 Pakia Cheti cha TIN'}</Text></TouchableOpacity>}
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>{current.key==='customer'? 'Tuma OTP' : 'Fungua Akaunti Moja kwa Moja'}</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff',padding:20,paddingTop:50},
  title:{fontSize:26,fontWeight:'bold',marginBottom:10},
  label:{fontWeight:'600',marginTop:15,marginBottom:6},
  input:{borderWidth:1,borderColor:'#ddd',borderRadius:10,padding:14,backgroundColor:'#f9f9f9'},
  roleBox:{flexDirection:'row',alignItems:'center',padding:14,borderWidth:1.5,borderColor:'#007aff',borderRadius:12,backgroundColor:'#e3f2fd'},
  emoji:{fontSize:24,marginRight:10}, roleText:{fontWeight:'700',flex:1}, badge:{fontSize:10,color:'#007aff'},
  vendorTypeRow:{flexDirection:'row',gap:10,marginTop:5},
  typeCard:{flex:1,borderWidth:2,borderColor:'#ddd',borderRadius:12,padding:12,alignItems:'center',backgroundColor:'#f9f9f9'},
  typeCardActive:{borderColor:'#007AFF',backgroundColor:'#E8F0FE'},
  typeEmoji:{fontSize:28,marginBottom:4},
  typeLabel:{fontSize:12,fontWeight:'600',textAlign:'center',color:'#666'},
  typeLabelActive:{color:'#007AFF'},
  section:{marginTop:20,fontWeight:'800',fontSize:15},
  docBtn:{borderWidth:1,borderColor:'#ccc',borderStyle:'dashed',padding:14,borderRadius:10,marginTop:8,alignItems:'center'},
  button:{backgroundColor:'#007aff',padding:16,borderRadius:12,marginTop:30,alignItems:'center'},
  btnText:{color:'#fff',fontWeight:'bold',fontSize:16}
});