import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

export default function AdminTranslations() {
  const { t } = useLanguage();
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('translations').select('*').order('key');
    if(error) console.log(error);
    if(data) setTranslations(data);
    setLoading(false);
  };

  // Group kwa key ili uone sw na en pamoja
  const grouped = translations.reduce((acc, curr) => {
    if(!acc[curr.key]) acc[curr.key] = { id: curr.key, key: curr.key };
    acc[curr.key][curr.lang] = curr.value;
    acc[curr.key][curr.lang + '_id'] = curr.id; // tunahifadhi id kwa update
    return acc;
  }, {});

  const groupedArray = Object.values(grouped);

  const updateGrouped = (key, lang, value) => {
    setTranslations(prev => prev.map(tr => tr.key === key && tr.lang === lang ? {...tr, value} : tr));
  };

  const saveTranslation = async (item) => {
    // update sw
    const { error: err1 } = await supabase.from('translations').update({ value: item.sw }).eq('id', item.sw_id);
    const { error: err2 } = await supabase.from('translations').update({ value: item.en }).eq('id', item.en_id);
    
    if(!err1 && !err2) Alert.alert(t('success'), t('saved'));
    else Alert.alert(t('error'), (err1 || err2)?.message);
  };

  const filtered = groupedArray.filter(tr => tr.key.toLowerCase().includes(filter.toLowerCase()));

  if(loading) return <ActivityIndicator style={{marginTop: 100}} size="large" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('manage_translations')}</Text>
      <TextInput style={styles.search} placeholder={t('search_key')} value={filter} onChangeText={setFilter} />
      {filtered.map(tr => (
        <View key={tr.id} style={styles.card}>
          <Text style={styles.key}>{tr.key}</Text>
          <TextInput 
            style={styles.input} 
            value={tr.sw || ''} 
            onChangeText={v => updateGrouped(tr.key, 'sw', v)} 
            placeholder="Swahili" 
          />
          <TextInput 
            style={styles.input} 
            value={tr.en || ''} 
            onChangeText={v => updateGrouped(tr.key, 'en', v)} 
            placeholder="English" 
          />
          <TouchableOpacity style={styles.btn} onPress={() => saveTranslation(tr)}>
            <Text style={styles.btnText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#f5f5f5', paddingTop:60, padding:20},
  title:{fontSize:22, fontWeight:'bold', marginBottom:15},
  search:{backgroundColor:'#fff', padding:12, borderRadius:10, marginBottom:15, borderWidth:1, borderColor:'#ddd'},
  card:{backgroundColor:'#fff', padding:15, borderRadius:12, marginBottom:12},
  key:{fontWeight:'bold', marginBottom:8, color:'#007aff'},
  input:{backgroundColor:'#f9f9f9', borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:10, marginBottom:8},
  btn:{backgroundColor:'#007aff', padding:12, borderRadius:8, alignItems:'center'},
  btnText:{color:'#fff', fontWeight:'bold'}
});