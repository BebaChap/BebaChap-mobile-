import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';

const ROLES = [
  { key: 'customer', label: 'Mteja', emoji: '👤' },
  { key: 'driver', label: 'Dereva', emoji: '🏍' },
  { key: 'vendor', label: 'Muuzaji / Duka', emoji: '🏪' },
  { key: 'garage', label: 'Fundi Gereji', emoji: '🔧' },
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
    if(init === 'admin') return 0; // admin asijisajili hapa
    const idx = ROLES.findIndex(r => r.key === init);
    return idx >=0? idx : 0;
  });
  const [docs, setDocs] = useState({}); // {nidaFile, licenseFile, tinFile}
  const [loading, setLoading] = useState(false);
  const { registerCustomer, registerBusiness, checkAdminExists } = useAuth();

  const current = ROLES[roleIndex];

  const pickDoc = async (type) => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
    if (!res.canceled) setDocs(prev => ({...prev, [type]: res.assets[0].uri}));
  };

  const handleRegister = async () => {
    if (name.trim().length < 3) return Alert.alert('Kosa','Jaza jina kamili');

    // MTEJA
    if (current.key === 'customer') {
      const raw = phone.replace(/\D/g,'').replace(/^0+/, '').replace(/^255/,'');
      if (raw.length!== 9) return Alert.alert('Kosa','Weka namba sahihi');
      setLoading(true);
      try {
        const fullPhone = `+255${raw}`;
        // sendOtp flow
        navigation.navigate('OTP', { name, phone: fullPhone, role: 'customer', isLogin: false });
      } finally { setLoading(false); }
      return;
    }

    // DEREVA / VENDOR / GEREJI
    if (!email.includes('@')) return Alert.alert('Kosa','Email si sahihi');
    if (nida.length < 15) return Alert.alert('Kosa','NIDA lazima iwe namba 20');
    if (current.key === 'driver' && licenseNo.length < 5) return Alert.alert('Kosa','Weka namba ya leseni');
    if ((current.key === 'vendor' || current.key === 'garage') && tin.length < 5) return Alert.alert('Kosa','Weka TIN namba');
    if (!docs.nidaFile) return Alert.alert('Kosa','Ambatisha picha ya NIDA');

    setLoading(true);
    try {
      const payload = {
        name, email: email.trim(), phone: `+255${phone.replace(/\D/g,'').replace(/^0+/,'').replace(/^255/,'')}`,
        role: current.key, nida, licenseNo, tin, documents: docs
      };
      const res = await registerBusiness(payload); // backend itaweka status = pending
      if (res.success) {
        Alert.alert('Imefanikiwa', 'Akaunti imetumwa kwa uhakiki. Utajibiwa ndani ya masaa 24');
        navigation.navigate('Login');
      } else Alert.alert('Imeshindikana', res.message);
    } catch(e){ Alert.alert('Kosa','Mtandao'); } finally { setLoading(false); }
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

          {current.key === 'driver' && <>
            <Text style={styles.label}>Leseni Namba</Text>
            <TextInput style={styles.input} value={licenseNo} onChangeText={setLicenseNo} placeholder="4001234567" />
          </>}
          {(current.key === 'vendor' || current.key === 'garage') && <>
            <Text style={styles.label}>TIN Namba</Text>
            <TextInput style={styles.input} value={tin} onChangeText={setTin} placeholder="123-456-789" />
          </>}

          <Text style={styles.section}>Ambatisha Nyaraka</Text>
          <TouchableOpacity style={styles.docBtn} onPress={() => pickDoc('nidaFile')}><Text>{docs.nidaFile? '✅ NIDA Imeambatishwa' : '📎 Pakia Kitambulisho NIDA'}</Text></TouchableOpacity>
          {current.key === 'driver' && <TouchableOpacity style={styles.docBtn} onPress={() => pickDoc('licenseFile')}><Text>{docs.licenseFile? '✅ Leseni Imeambatishwa' : '📎 Pakia Leseni ya Udereva'}</Text></TouchableOpacity>}
          {(current.key === 'vendor' || current.key === 'garage') && <TouchableOpacity style={styles.docBtn} onPress={() => pickDoc('tinFile')}><Text>{docs.tinFile? '✅ TIN Imeambatishwa' : '📎 Pakia Cheti cha TIN'}</Text></TouchableOpacity>}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>{current.key==='customer'? 'Tuma OTP' : 'Tuma Maombi ya Uhakiki'}</Text>}
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
  section:{marginTop:20,fontWeight:'800',fontSize:15},
  docBtn:{borderWidth:1,borderColor:'#ccc',borderStyle:'dashed',padding:14,borderRadius:10,marginTop:8,alignItems:'center'},
  button:{backgroundColor:'#007aff',padding:16,borderRadius:12,marginTop:30,alignItems:'center'},
  btnText:{color:'#fff',fontWeight:'bold',fontSize:16}
});