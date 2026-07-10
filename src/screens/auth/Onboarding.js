import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import StepButtons from '../../components/StepButtons';

const { width } = Dimensions.get('window');

const SLIDES = [
  { id: '1', title: 'Usafiri wa Haraka', desc: 'Pata bodaboda, bajaji, au teksi ndani ya dakika', emoji: '🏍' },
  { id: '2', title: 'Duka Mtandaoni', desc: 'Nunua bidhaa kutoka maduka ya jirani na uletewe', emoji: '🛒' },
  { id: '3', title: 'Gereji Mkononi', desc: 'Pata fundi wa kuaminika karibu nawe haraka', emoji: '🔧' },
  { id: '4', title: 'Malipo Salama', desc: 'Lipa kwa M-Pesa, Tigo Pesa, Airtel Money au kadi', emoji: '💳' },
];

export default function Onboarding({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Auth');
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
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
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
          nextText={currentIndex === SLIDES.length - 1? 'Anza Sasa' : 'Next'}
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