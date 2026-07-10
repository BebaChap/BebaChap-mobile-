import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

const FAKE_NOTIS = [
  { 
    id: '1', 
    title: 'Oda Mpya', 
    body: 'Umepewa oda ya chips kuku kutoka kwa John', 
    time: '2m ago',
    read: false 
  },
  { 
    id: '2', 
    title: 'Ride Request', 
    body: 'Mteja yupo Sinza, anataka kwenda Mikocheni', 
    time: '5m ago',
    read: false 
  },
  { 
    id: '3', 
    title: 'Malipo Yamekamilika', 
    body: 'TSH 15,000 zimeingia kwenye akaunti yako', 
    time: '1h ago',
    read: true 
  },
  { 
    id: '4', 
    title: 'Rating Mpya', 
    body: 'Umepewa nyota 5 na mteja', 
    time: '3h ago',
    read: true 
  },
];

const Notifications = ({ navigation }) => {
  
  const handlePress = (item) => {
    console.log('Clicked:', item.id);
    // navigation.navigate('NotificationDetail', { notification: item })
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, !item.read && styles.unreadCard]} 
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.cardBody}>{item.body}</Text>
      <Text style={styles.cardTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.headerTitle}>Notifications</Text>
      
      <FlatList
        data={FAKE_NOTIS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    paddingHorizontal: 20, 
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff'
  },
  listContent: {
    paddingBottom: 20
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007aff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#1c1c1e',
    flex: 1
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007aff',
    marginLeft: 8
  },
  cardBody: { 
    fontSize: 14, 
    color: '#666', 
    lineHeight: 20,
    marginBottom: 8
  },
  cardTime: { 
    fontSize: 12, 
    color: '#999' 
  },
});

export default Notifications;
