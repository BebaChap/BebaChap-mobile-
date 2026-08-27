import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { LANGUAGES as LANGUAGE_META } from '../../constants/languages';
import { COLORS } from '../../theme/colors';

export default function LanguageSelect() {
  const { language, changeLanguage, t, isRTL } = useLanguage();

  const renderOption = ({ item }) => {
    const active = language === item.code;
    return (
      <TouchableOpacity
        style={[styles.option, active && styles.activeOption]}
        onPress={() => changeLanguage(item.code)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.nameWrap}>
          <Text style={[styles.nativeName, active && styles.activeText]}>
            {item.name}
          </Text>
          <Text style={styles.subtitle}>{item.label}</Text>
        </View>
        {active && <Text style={styles.check}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('change_language')}</Text>
      <Text style={styles.hint}>{t('tap_to_change')}</Text>
      <FlatList
        data={LANGUAGE_META}
        keyExtractor={(item) => item.code}
        renderItem={renderOption}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  hint: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 16,
  },
  list: { paddingBottom: 40 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeOption: {
    borderColor: COLORS.primary,
  },
  flag: { fontSize: 30, marginRight: 14 },
  nameWrap: { flex: 1 },
  nativeName: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textGray, marginTop: 2 },
  check: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
});
