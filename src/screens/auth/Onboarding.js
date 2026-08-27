import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StepButtons from '../../components/StepButtons';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

const SLIDES = [
  { id: '1', titleKey: 'ob_ride_title', descKey: 'ob_ride_desc', emoji: '🏍' },
  { id: '2', titleKey: 'ob_shop_title', descKey: 'ob_shop_desc', emoji: '🛒' },
  { id: '3', titleKey: 'ob_garage_title', descKey: 'ob_garage_desc', emoji: '🔧' },
  { id: '4', titleKey: 'ob_pay_title', descKey: 'ob_pay_desc', emoji: '💳' },
];

export default function Onboarding({ navigation }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const goNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // FIX KUBWA HAPA
      try {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      } catch (e) {
        console.log('Error saving onboarding', e);
      }
      navigation.replace('Login');
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{t(item.titleKey)}</Text>
            <Text style={styles.desc}>{t(item.descKey)}</Text>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.activeDot]} />
          ))}
        </View>
        <StepButtons
          onNext={goNext}
          onBack={currentIndex > 0? goBack : null}
          nextText={currentIndex === SLIDES.length - 1 ? t('start_now') : t('next')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  slide: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emoji: { fontSize: 100, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  desc: { fontSize: 16, textAlign: 'center', color: '#666', paddingHorizontal: 20 },
  footer: { padding: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd', margin: 4 },
  activeDot: { backgroundColor: '#007aff', width: 24 },
});