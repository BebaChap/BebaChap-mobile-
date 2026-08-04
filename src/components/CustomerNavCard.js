import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function CustomerNavCard({ 
  onBack, 
  onNext, 
  backText = "Rudi", 
  nextText = "Endelea",
  showBack = true,
  showNext = true,
  nextDisabled = false
}) {
  return (
    <View style={styles.navCard}>
      {/* BACK BUTTON */}
      {showBack ? (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#333" />
          <Text style={styles.backText}>{backText}</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {/* DOTS INDICATOR KATI KATI */}
      <View style={styles.dots}>
        <View style={styles.dotActive} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* NEXT BUTTON */}
      {showNext ? (
        <TouchableOpacity 
          style={[styles.nextBtn, nextDisabled && { backgroundColor: '#ccc' }]} 
          onPress={onNext}
          disabled={nextDisabled}
        >
          <Text style={styles.nextText}>{nextText}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={{ flex: 1 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginTop: 15,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  backText: { fontWeight: '700', color: '#333', fontSize: 14 },
  dots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ddd' },
  dotActive: { width: 20, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 8,
  },
  nextText: { fontWeight: '700', color: '#fff', fontSize: 14 },
});