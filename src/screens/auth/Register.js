import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const ROLES = [
  { key: 'customer', label: 'Mteja', emoji: '👤' },
  { key: 'driver', label: 'Dereva', emoji: '🏍️' },
  { key: 'vendor', label: 'Duka', emoji: '🏪' },
  { key: 'garage', label: 'Gereji', emoji: '🔧' },
  { key: 'admin', label: 'Admin', emoji: '🛡️' }, // ongeza hapa
];

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { sendOtp } = useAuth();

  const current = ROLES[roleIndex];

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '');
    if (cleanName.length < 2) return Alert.alert('Kosa','Jaza jina');
    if (cleanPhone.length!== 9) return Alert.alert('Kosa','Weka 712345678');

    try {
      setLoading(true);
      const res = await sendOtp(`+255${cleanPhone}`);
      if (res.success) navigation.navigate('Otp',{ name:cleanName, phone:`+255${cleanPhone}`, role: current.key });
      else Alert.alert('Kosa', res.message);
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:40}}>
      <Text style={styles.title}>Jisajili</Text>

      <Text style={styles.label}>Jina Kamili</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Juma Mzuri"/>

      <Text style={styles.label}>Namba ya Simu</Text>
      <View style={styles.phoneRow}><Text style={styles.prefix}>+255</Text>
      <TextInput style={styles.inputPhone} value={phone} onChangeText={setPhone} placeholder="712345678" keyboardType="phone-pad"/></View>

      <Text style={styles.label}>Wewe ni nani?</Text>
      <TouchableOpacity style={styles.roleBox} onPress={()=> setRoleIndex((i)=>(i+1)%ROLES.length)}>
        <Text style={styles.roleEmoji}>{current.emoji}</Text>
        <Text style={styles.roleText}>{current.label}</Text>
        <Text style={styles.hint}>Bonyeza kubadilisha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading?'Inatuma...':'Jisajili'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff',paddingHorizontal:20,paddingTop:60},
  title:{fontSize:28,fontWeight:'bold',marginBottom:30},
  label:{fontSize:16,fontWeight:'600',marginTop:15,marginBottom:8},
  input:{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:15,fontSize:16},
  phoneRow:{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#ddd',borderRadius:8},
  prefix:{paddingLeft:15,fontWeight:'600'},
  inputPhone:{flex:1,padding:15,fontSize:16},
  roleBox:{flexDirection:'row',alignItems:'center',padding:18,borderWidth:1,borderColor:'#007aff',borderRadius:8,backgroundColor:'#e3f2fd',marginTop:10},
  roleEmoji:{fontSize:26,marginRight:15},
  roleText:{flex:1,fontSize:18,fontWeight:'600'},
  hint:{fontSize:12,color:'#007aff'},
  button:{backgroundColor:'#007aff',padding:18,borderRadius:8,marginTop:30},
  buttonText:{color:'#fff',textAlign:'center',fontSize:18,fontWeight:'bold'},
});