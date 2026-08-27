import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AdminTranslations() {
  const { t } = useLanguage();
  const [keyName, setKeyName] = useState('');
  const [swValue, setSwValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const loadTranslations = async () => {
    const { data } = await supabase.from('translations').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setList(data);
  };

  useEffect(() => { loadTranslations(); }, []);

  const handleTranslate = async () => {
    if (!keyName.trim() || !swValue.trim()) {
      Alert.alert(t('fill_fields'), t('enter_key_sw'));
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('auto-translate', {
        body: { key: keyName.trim().toLowerCase().replace(/\s+/g, '_'), value_sw: swValue.trim() }
      });

      if (error) throw error;

      if (data?.success) {
        Alert.alert(t('success_title'), `${t('translated_6_langs')}\n${JSON.stringify(data.translations, null, 2)}`);
        setKeyName('');
        setSwValue('');
        loadTranslations();
      } else {
        Alert.alert("Result", JSON.stringify(data));
      }
    } catch (e) {
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('add_translation')}</Text>
      <Text style={styles.sub}>{t('write_sw_ai_translate')}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>{t('key_example')}</Text>
        <TextInput
          style={styles.input}
          placeholder="welcome_message"
          value={keyName}
          onChangeText={setKeyName}
          autoCapitalize="none"
        />

        <Text style={styles.label}>{t('swahili')}</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder={t('ph_swahili_example')}
          value={swValue}
          onChangeText={setSwValue}
          multiline
        />

        <TouchableOpacity style={styles.btn} onPress={handleTranslate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{t('translate_6_langs')}</Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.listTitle}>{t('recent_translations')} ({list.length})</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => `${item.key}_${item.lang}`}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemKey}>{item.key} [{item.lang}]</Text>
            <Text style={styles.itemVal}>{item.value}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: '800' },
  sub: { color: '#666', marginBottom: 20, marginTop: 4 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 16, elevation: 3, marginBottom: 20 },
  label: { fontWeight: '700', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  btn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  listTitle: { fontWeight: '800', marginBottom: 10 },
  item: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 8 },
  itemKey: { fontWeight: '700', fontSize: 12, color: COLORS.primary },
  itemVal: { marginTop: 4 }
});